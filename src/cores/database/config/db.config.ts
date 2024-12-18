import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import config from "../../../common/configs/env.config";
import { User } from "../../../modules/users/entities/user.entity";

// Tải thông tin cấu hình từ file .env.config
dotenv.config({ path: ".env.config" });

// Lấy thông tin cấu hình PostgreSQL
const { HOST, PORT, USERNAME, DATABASE, PASSWORD } = config.postgres;
console.log(PASSWORD, 'PASSWORD');
// Khởi tạo Sequelize
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: HOST,
  port: Number(PORT),
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  logging: true, // Bật logging SQL
  models: [User], // Đường dẫn tới các model
  // synchronize: true, // Tự động đồng bộ hóa các model với cơ sở dữ liệu
});
