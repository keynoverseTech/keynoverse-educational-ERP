import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { join } from 'path';
import config from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/users.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ConsoleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = process.env.NODE_ENV || 'development';
        const config = configService.get(env);

        // Validate DATABASE_URL in production
        const { Logger } = await import('@nestjs/common');
        const logger = new Logger('TypeORM');

        if (env === 'production') {
          if (!process.env.DATABASE_URL) {
            logger.error('❌ DATABASE_URL is not set in production environment!');
            logger.error('📋 To fix this in Railway:');
            logger.error('   1. Add a PostgreSQL service to your project');
            logger.error('   2. In your backend service → Variables tab');
            logger.error('   3. Add: DATABASE_URL=${{Postgres.DATABASE_URL}}');
            logger.error('   4. Or manually copy the DATABASE_URL from PostgreSQL service');
            throw new Error('DATABASE_URL is required in production');
          } else {
            // Log connection info (without password)
            const dbUrl = process.env.DATABASE_URL;
            const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@'); // Mask password
            logger.log(`✅ DATABASE_URL is set: ${maskedUrl}`);
          }
        }

        return {
          ...config,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          autoLoadEntities: true,
          // synchronize and logging are set in config/index.ts per environment
          // Don't override here - respect the config file settings
          extra: {
            max: 10, // Maximum connections in the pool
            min: 2, // Minimum connections in the pool
            idleTimeoutMillis: 300000, // Close idle connections after 30 seconds
          },
        };
      },
    }),
    CommonModule,
    ConsoleModule,
    AuthModule,
    UserModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
