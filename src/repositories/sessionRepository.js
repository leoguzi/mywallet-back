import connection from '../database.js';

async function registerSession({ idUser, token }) {
  const result = await connection.query(
    'INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *;',
    [idUser, token]
  );

  return result.rows[0];
}

async function deleteSession({ token }) {
  const result = await connection.query(
    'DELETE FROM sessions WHERE token = $1;',
    [token]
  );
  if (result.rowCount === 0) {
    return null;
  }
  return true;
}

async function fetchSession({ token }) {
  const session = await connection.query(
    'SELECT * FROM sessions WHERE token = $1;',
    [token]
  );
  return session.rows[0];
}

export { registerSession, deleteSession, fetchSession };
