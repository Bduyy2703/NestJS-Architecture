import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity'; // Sequelize model
import { UserInfo } from './entities/userinfo.entity'; // Sequelize model
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/env.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserInfo) private profileModel: typeof UserInfo,
  ) {}

  // Tạo user mới
  async create(registerDto: RegisterDto, tokenOTP: string): Promise<User> {
    const user = await this.userModel.create(
      {
        email: registerDto.email,
        password: await bcrypt.hash(registerDto.password, 10),
        isVerified: false,
        tokenOTP: tokenOTP,
        role: [Role.USER],
      },
      {
        include: [UserInfo], // Bao gồm bảng profile
      },
    );
    await user.$create('UserInfo', {
      userName: registerDto.username,
      phoneNumber: registerDto.phoneNumber,
    });
    return user;
  }

  // Lấy tất cả user
  async findAll(): Promise<User[]> {
    return await this.userModel.findAll({
      include: [UserInfo], // Bao gồm thông tin profile nếu cần
    });
  }
  //get info 
  async getUserInfo(userId: string): Promise<UserInfo> {
    return await this.profileModel.findOne({ where: { userId } });
  }
  // Lấy user theo ID
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, { include: [UserInfo] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Lấy user theo email
  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: { email },
    });
  }

  // Lấy user theo token OTP
  async findUserByToken(tokenOTP: string): Promise<User> {
    return await this.userModel.findOne({
      where: { tokenOTP },
    });
  }

  // Reset password
  async resetPassword(id: string): Promise<ResetPasswordDto> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    // Tạo mật khẩu ngẫu nhiên
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomPass = '';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomPass += alphabet[randomIndex];
    }

    const newPass = await bcrypt.hash(randomPass, 10);
    user.password = newPass;

    await user.save();

    const res = new ResetPasswordDto();
    res.message = 'Password reset successfully';
    res.newPassword = randomPass;

    return res;
  }

  // Cập nhật thông tin user
  async updateUser(user: Partial<User>): Promise<User> {
    const existingUser = await this.userModel.findByPk(user.id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật các thuộc tính
    if (user.isVerified !== undefined) existingUser.isVerified = user.isVerified;
    if (user.tokenOTP !== undefined) existingUser.tokenOTP = user.tokenOTP;

    await existingUser.save();

    return existingUser;
  }

  // Cập nhật mật khẩu
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    const isMatched = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isMatched) {
      throw new BadRequestException('Wrong old password');
    }

    const newPass = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = newPass;

    await user.save();

    return {
      message: 'Password successfully updated',
    };
  }

  // Xóa user theo ID
  async deleteById(id: string) {
    const deletedUser = await this.userModel.destroy({ where: { id } });

    if (!deletedUser) {
      throw new BadRequestException("Can't delete user");
    }

    return {
      message: 'Delete successful',
      code: HttpStatus.OK,
    };
  }
}
