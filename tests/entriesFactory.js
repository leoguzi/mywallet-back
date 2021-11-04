// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import connection from '../src/database';

export default async function createEntry(userId) {
  let newEntry = {
    userId,
    date: new Date(),
    value: ((Math.random() * 2 - 1) * 10000).toFixed(0),
    description: faker.lorem.words(3),
  };

  const entry = await connection.query(
    'INSERT INTO entries (user_id, date, value, description) values ($1, $2, $3, $4) RETURNING *;',
    [newEntry.userId, newEntry.date, newEntry.value, newEntry.description]
  );
  [newEntry] = entry.rows;

  return newEntry;
}
