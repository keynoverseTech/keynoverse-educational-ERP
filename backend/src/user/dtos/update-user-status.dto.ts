import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ example: true })
  @IsNotEmpty({ message: 'isActive status is required' })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive: boolean;
}
