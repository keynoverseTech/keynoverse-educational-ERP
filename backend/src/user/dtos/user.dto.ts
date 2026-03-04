import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountStatus, UserRoles } from 'src/constants';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  status: AccountStatus;

  @ApiProperty()
  @Expose()
  role: UserRoles;

  @ApiProperty({ required: false })
  @Expose()
  avatar?: string;
}
