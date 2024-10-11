import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'expres_api',
  password: 'admin',
  port: 5432,
});
