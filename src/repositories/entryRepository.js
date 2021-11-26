import connection from '../database.js';

async function registerEntry({ idUser, value, description, date }) {
  const result = await connection.query(
    'INSERT INTO entries (user_id, date, value, description) VALUES ($1, $2, $3, $4) RETURNING *;',
    [idUser, date, value, description]
  );

  return result.rows[0];
}

async function fetchUserEntries({ idUser }) {
  const result = await connection.query(
    'SELECT * FROM entries WHERE user_id=$1 ORDER BY id DESC;',
    [idUser]
  );
  return result.rows;
}

export { registerEntry, fetchUserEntries };
