import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize'; // Import SequelizeModuleOptions
import { User } from '../../../modules/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'], // Đường dẫn file env
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions => {
        return {
          dialect: 'postgres',
          host: configService.get<string>('DEV_DB_HOST'),
          port: configService.get<number>('DEV_DB_PORT'),
          username: configService.get<string>('DEV_DB_USERNAME', 'postgres'),
          password: configService.get<string>('DEV_DB_PASSWORD'),
          database: configService.get<string>('DEV_DB_DATABASE'),
          models: [User], // Liệt kê các model ở đây
          autoLoadModels: true, // Tự động tải model
          synchronize: true, // Đồng bộ hóa với DB (dùng cho môi trường dev)
          logging: true, // Bật SQL logging
        };
      },
    }),
  ],
})
export class DatabaseModule {}
