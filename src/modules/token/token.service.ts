import { Injectable } from '@nestjs/common';
import { SaveTokenDto } from './dto/save-token.dto';
import { UsersService } from '../users/user.service';
import { Token } from 'src/modules/token/entities/token.entity';  // Adjust this path if needed
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/modules/users/entities/user.entity';  // Adjust this path if needed
import { Op } from 'sequelize';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token) private tokenModel: typeof Token,  // Inject Token model
    private readonly usersService: UsersService,
  ) {}

  // Create or Update Token
  async create(user: User, saveTokenDto: SaveTokenDto) {
    // Check if token exists for user
    let token = await this.tokenModel.findOne({
      where: { userId: user.id },
    });

    if (token) {
      // If token exists, update it
      token = await token.update(saveTokenDto);  // update the token
    } else {
      // If token doesn't exist, create new token
      token = await this.tokenModel.create({
        ...saveTokenDto,
        userId: user.id,
      });
    }

    return token;
  }

  // Update an existing token
  async update(token: Token) {
    return await this.tokenModel.update(token, {
      where: { id: token.id },
    });
  }

  // Find token by refreshTokenUsed
  async findByRefreshTokenUsed(refreshToken: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: {
        refreshTokenUsed: {
          [Op.contains]: [refreshToken],  // Sequelize's `Op.contains` for array matching
        },
      },
    });
  }

  // Find token by refreshToken
  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { refreshToken },
    });
  }

  // Find token by accessToken
  async findAccessToken(accessToken: string): Promise<Token | null> {
    return await this.tokenModel.findOne({
      where: { accessToken },
    });
  }

  // Delete token by userId
  async deleteByUserId(userId: string): Promise<Token> {
    const token = await this.tokenModel.findOne({
      where: { userId },
    });

    if (token) {
      await token.destroy();  // Delete token
      return token;
    }

    throw new Error('Token not found');  // Handle token not found case
  }
}
