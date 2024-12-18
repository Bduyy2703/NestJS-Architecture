import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType, PrimaryKey, Unique, Default, HasOne } from 'sequelize-typescript';
import { UserInfo } from './userinfo.entity';
import { Role } from 'src/common/enums/env.enum';

@Table
export class User extends Model<User> {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @ApiProperty()
  @Unique
  @Column
  email: string;

  @ApiProperty()
  @Default(false)
  @Column
  isVerified: boolean;

  @ApiProperty()
  @Unique
  @Column
  tokenOTP: string;

  @ApiProperty({ example: '123', description: 'The age of the Cat' })
  @Column
  password: string;

  @ApiProperty()
  @Default([Role.USER])
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(Role))),
  })
  role: Role[];

  @HasOne(() => UserInfo)
  UserInfo: UserInfo;
}
