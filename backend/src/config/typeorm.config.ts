/* eslint-disable @typescript-eslint/no-require-imports */
//src/config/typeorm.congig.ts
require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';
import config from '.';
import { join } from 'path';

const options = config()[process.env.NODE_ENV || 'development'];
const dataSource = new DataSource({
  ...options,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
} as DataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

export default dataSource;
