import { ApiProperty } from '@nestjs/swagger';
import { Column, ForeignKey, Model, Table, DataType, PrimaryKey, Default, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from '../../../common/enums/env.enum';

@Table({ tableName: 'userInfo' })
export class UserInfo extends Model<UserInfo> {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @ApiProperty()
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  @ApiProperty()
  user: User;

  @ApiProperty()
  @Default('')
  @Column
  userName: string;

  @ApiProperty()
  @Default('')
  @Column
  phoneNumber: string;

  @ApiProperty()
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
