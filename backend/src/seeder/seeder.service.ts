import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserSeederService } from './user-seeder.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly userSeeder: UserSeederService,
  ) {
    this.logger.log('SeederService initialized');
  }

  async resetDatabase(): Promise<void> {
    this.logger.log('Resetting database...');
    try {
      // Drop all tables in the public schema
      const tables = await this.dataSource.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
      `);

      if (tables.length > 0) {
        const tableNames = tables
          .map((table: { table_name: string }) => `"${table.table_name}"`)
          .join(', ');
        await this.dataSource.query(
          `DROP TABLE IF EXISTS ${tableNames} CASCADE;`,
        );
        this.logger.log('All tables dropped successfully');
      } else {
        this.logger.log('No tables found to drop');
      }

      // Drop and recreate the public schema
      await this.dataSource.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
      await this.dataSource.query(`CREATE SCHEMA public;`);
      await this.dataSource.query(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      );

      // Create enum types
      const enumTypes = [
        {
          name: 'user_role_enum',
          values: [
            'super_admin',
            'admin',
            'staff',
            'student',
          ],
        },
        {
          name: 'user_status',
          values: ['active', 'inactive', 'suspende'],
        },
        {
          name: 'payment_status_enum',
          values: ['pending', 'paid', 'failed'],
        },
      ];

      for (const enumType of enumTypes) {
        const typeExists = await this.dataSource.query(`
          SELECT EXISTS (
            SELECT 1
            FROM pg_type
            WHERE typname = '${enumType.name}'
            AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
          );
        `);
        if (!typeExists[0].exists) {
          await this.dataSource.query(`
            CREATE TYPE "public"."${enumType.name}" AS ENUM (${enumType.values.map((value) => `'${value}'`).join(', ')});
          `);
          this.logger.log(`Created enum type: ${enumType.name}`);
        } else {
          this.logger.log(
            `Enum type ${enumType.name} already exists, skipping`,
          );
        }
      }

      this.logger.log('Database reset successfully');
    } catch (error) {
      this.logger.error('Failed to reset database', error.stack);
      throw new Error(`Database reset failed: ${error.message}`);
    }
  }

  async ensureSchema(): Promise<void> {
    this.logger.log('Ensuring database schema is synchronized...');
    try {
      if (!this.dataSource.isInitialized) {
        throw new Error(
          'DataSource is not initialized. Ensure TypeOrmModule is properly configured.',
        );
      }

      // Synchronize schema with entities
      await this.dataSource.synchronize();
      this.logger.log('Database schema synchronized successfully');
    } catch (error) {
      this.logger.error('Failed to synchronize database schema', error.stack);
      throw new Error(`Schema synchronization failed: ${error.message}`);
    }
  }

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');
    try {
      const savedUsers = await this.userSeeder.seed();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Failed to seed database', error.stack);
      throw new Error(`Database seeding failed: ${error.message}`);
    }
  }

  async resetAndSeed(): Promise<void> {
    this.logger.log('Starting reset and seed process...');
    const maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        await this.resetDatabase();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.ensureSchema();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.seed();
        this.logger.log('Reset and seed completed successfully');
        return;
      } catch (error) {
        this.logger.error(
          `Attempt ${attempt} failed: ${error.message}`,
          error.stack,
        );
        if (attempt === maxRetries) {
          throw new Error(
            `Reset and seed failed after ${maxRetries} attempts: ${error.message}`,
          );
        }
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
