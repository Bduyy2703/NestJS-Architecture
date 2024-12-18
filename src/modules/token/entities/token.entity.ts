import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';

@Table({ tableName: 'keyToken' }) // Tên bảng trong cơ sở dữ liệu
export class Token extends Model<Token> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id', // Tên cột trong bảng
  })
  userId: number;

  @BelongsTo(() => User) // Quan hệ với bảng User
  user: User;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: [],
  })
  refreshTokenUsed: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accessToken: string;
}
