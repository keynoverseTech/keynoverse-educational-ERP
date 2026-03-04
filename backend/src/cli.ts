// src/cli.ts
import { NestFactory } from '@nestjs/core';
import { ConsoleService } from 'nestjs-console';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const consoleService = app.get(ConsoleService);
    const seederService = app.get(SeederService);

    // Get the root commander instance
    const cli = consoleService.getCli();

    // Register commands manually
    consoleService.createCommand(
      {
        command: 'seed:reset',
        description: 'Reset and seed the database with initial data',
      },
      async () => {
        console.log('Starting reset and seed process...');
        await seederService.resetAndSeed();
        console.log('Database reset and seeded successfully');
      },
      cli, // Pass the root cli as the parent
    );

    consoleService.createCommand(
      {
        command: 'seed',
        description: 'Seed the database with initial data (no reset)',
      },
      async () => {
        console.log('Starting seed process...');
        await seederService.seed();
        console.log('Database seeded successfully');
      },
      cli, // Pass the root cli as the parent
    );

    // Parse CLI arguments and execute
    await cli.parseAsync(process.argv);
  } catch (err) {
    console.error('CLI Error:', err);
    await app.close();
    process.exit(1);
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Bootstrap Error:', err);
  process.exit(1);
});
