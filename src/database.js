import pg from "pg";
const { Pool } = pg;

const connection = new Pool({
  user: "postgres",
  password: "123456",
  host: "localhost",
  database: "mywallet",
});

export default connection;
