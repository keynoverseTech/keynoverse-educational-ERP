//src/config/index.ts
export default () => ({
  development: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || process.env.USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'postgres',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
    ssl: false, // Disable SSL for local development
  },
  test: {
    type: 'postgres',
    host: process.env.POSTGRES_TEST_HOST,
    username: process.env.POSTGRES_TEST_USER,
    password: process.env.POSTGRES_TEST_PW,
    database: process.env.POSTGRES_TEST_DB,
    port: parseInt(process.env.POSTGRES_TEST_PORT || '5432'),
    autoLoadEntities: true,
    logging: false,
  },
  staging: {
    // Add if needed
  },
  production: {
    type: 'postgres',
    url: process.env.DATABASE_URL, // Use DATABASE_URL
    autoLoadEntities: true,
    synchronize: false, // NEVER use synchronize in production - use migrations instead
    logging: false, // Disable logging in production
    // Railway PostgreSQL connection string includes SSL settings
    // If DATABASE_URL doesn't specify SSL, add it for Railway compatibility
    ...(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=')
      ? {
          ssl: {
            rejectUnauthorized: false, // Railway uses self-signed certificates
          },
        }
      : {}),
  },
});
