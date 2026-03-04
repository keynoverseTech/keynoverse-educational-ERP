import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/users.module';
import { SeederService } from './seeder.service';
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    UserModule,
  ],
  providers: [
    SeederService,
    UserSeederService,
  ],
  exports: [SeederService],
})
export class SeederModule { }
