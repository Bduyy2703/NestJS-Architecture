import { Sequelize } from 'sequelize';
import { User } from 'src/modules/users/entities/user.entity'; // Sequelize Model

export class UserSeeder {
  public static async run(sequelize: Sequelize): Promise<void> {
    try {
      // Xóa toàn bộ dữ liệu trong bảng User
      await sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');

      // Chèn dữ liệu mới
      await User.bulkCreate([
        {
          email: 'Duy@gmail.com',
          password: '123', // Lưu ý: Cần hash password trước khi lưu thực tế
        },
      ]);

      console.log('Users seeded successfully!');
    } catch (error) {
      console.error('Error while seeding users:', error);
    }
  }
}
