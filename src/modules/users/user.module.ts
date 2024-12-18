import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/userinfo.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserInfo]), // Đổi từ TypeOrmModule sang SequelizeModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
