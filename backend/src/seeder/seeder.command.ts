import { Command, Console } from 'nestjs-console';
import { SeederService } from './seeder.service';

@Console()
export class SeederCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed',
    description: 'Seed the database with mock data',
  })
  async seed(): Promise<void> {
    console.log('Running database seeder...');
    await this.seederService.seed();
    console.log('Database seeded successfully');
  }

  @Command({
    command: 'reset',
    description: 'Reset the database',
  })
  async reset(): Promise<void> {
    console.log('Resetting database...');
    await this.seederService.resetDatabase();
    console.log('Database reset successfully');
  }

  @Command({
    command: 'seed:reset',
    description: 'Reset and seed the database with mock data',
  })
  async resetAndSeed(): Promise<void> {
    console.log('Running reset and seed...');
    await this.seederService.resetAndSeed();
    console.log('Database reset and seeded successfully');
  }
}
