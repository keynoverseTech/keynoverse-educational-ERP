// src/user/dtos/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: 'user@planetstech.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'student', enum: UserRole })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 'SEC12345', required: false })
  @IsOptional()
  secNumber?: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/150?img=4', required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  passwordUpdated?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({ example: 'user@planetstech.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiProperty({ example: 'guest', enum: UserRole, required: false })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0EAwImjAAADeRNzFX9qSAAAAABJRU5ErkJggg==',
    required: false,
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  passwordUpdated?: boolean;
}
