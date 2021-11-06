import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

const envFile = '';
let connString = '';

if (process.env.NODE_ENV === 'prod') {
  connString = process.env. 
}

 ? '.env' : '.env.test';

dotenv.config({
  path: envFile,
});

const connection = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
});

export default connection;
