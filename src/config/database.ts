import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  development: Knex.Config;
  production: Knex.Config;
  test: Knex.Config;
}

const config: DatabaseConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'hr_management',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_TEST_NAME || 'hr_management_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
};

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment as keyof DatabaseConfig];

export const db = knex(knexConfig);
export default config;