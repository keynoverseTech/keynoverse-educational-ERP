import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  STUDENT = 'student',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  secNumber?: string; //staff_no for admin and staff and admission_number for student

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  // Consider storing large avatars in a file storage service (e.g., S3) and saving the URL here instead of the base64 string directly.
  avatar?: string;

  @Column({ default: false })
  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  passwordUpdated: boolean;
}
