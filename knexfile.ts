import type { Knex } from 'knex';
import { config } from 'dotenv';

config();

const knexConfig: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
};

export default knexConfig;
