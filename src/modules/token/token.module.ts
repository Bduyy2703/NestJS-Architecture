import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';
import { UsersModule } from '../users/user.module';
@Module({
  imports: [
    SequelizeModule.forFeature([Token]), // Sử dụng SequelizeModule để khai báo model Token
    UsersModule, // Kết nối với UsersModule
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
