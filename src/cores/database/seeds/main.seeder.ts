import { Sequelize } from 'sequelize';
import { UserSeeder } from './user.seeder';

export class MainSeeder {
  constructor(private sequelize: Sequelize) {}

  async run(): Promise<void> {
    console.log('Running Main Seeder...');
    await UserSeeder.run(this.sequelize);
  }
}
