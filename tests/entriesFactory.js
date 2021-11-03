import connection from "../src/database";
import faker from "faker";

export default async function createEntry(user_id) {
  let newEntry = {
    user_id,
    date: new Date(),
    value: ((Math.random() * 2 - 1) * 10000).toFixed(0),
    description: faker.lorem.words(3),
  };

  const entry = await connection.query(
    `INSERT INTO entries (user_id, date, value, description) values ($1, $2, $3, $4) RETURNING *;`,
    [newEntry.user_id, newEntry.date, newEntry.value, newEntry.description]
  );

  newEntry = entry.rows[0];

  return newEntry;
}
