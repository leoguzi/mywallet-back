import connection from "../src/database";
import { v4 as uuid } from "uuid";

export default async function createSession(user) {
  const token = uuid();
  const response = await connection.query(
    `INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *;`,
    [user.id, token]
  );
  return response.rows[0];
}
