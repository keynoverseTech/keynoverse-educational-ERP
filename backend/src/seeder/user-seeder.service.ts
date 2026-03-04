// src/seeders/user-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    this.logger.log('UserSeederService initialized');
  }

  async seed(): Promise<User[]> {
    this.logger.log('Seeding users...');
    const users = [
      {
        id: uuidv4(),
        name: 'Super Admin ',
        email: 'superadmin@planetstech.com',
        password: await bcrypt.hash('super@password', 10),
        role: UserRole.SUPER_ADMIN,
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@planetstech.com',
        password: await bcrypt.hash('admin@password', 10),
        role: UserRole.ADMIN,
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      {
        id: uuidv4(),
        name: 'Staff User',
        email: 'staff@planetstech.com',
        password: await bcrypt.hash('staff@password', 10),
        role: UserRole.STAFF,
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      {
        id: uuidv4(),
        name: 'Student User',
        email: 'student@planetstech.com',
        password: await bcrypt.hash('student@password', 10),
        role: UserRole.STUDENT,
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
    ];

    const savedUsers: User[] = [];
    for (const user of users) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: user.email },
      });
      if (!existingUser) {
        try {
          const savedUser = await this.usersRepository.save(user);
          savedUsers.push(savedUser);
          this.logger.log(`Seeded user: ${user.email}`);
        } catch (error) {
          this.logger.error(`Failed to seed user ${user.email}`, error.stack);
          throw new Error(
            `Failed to seed user ${user.email}: ${error.message}`,
          );
        }
      } else {
        this.logger.log(`User ${user.email} already exists, skipping`);
        savedUsers.push(existingUser);
      }
    }
    return savedUsers;
  }
}
