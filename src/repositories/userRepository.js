import connection from '../database.js';

async function fetchUserByEmail({ email }) {
  const user = await connection.query('SELECT * FROM users WHERE email=$1;', [
    email,
  ]);

  if (user.rowCount > 0) {
    return user.rows[0];
  }
  return null;
}

async function registerUser({ name, email, password }) {
  const result = await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
    [name, email, password]
  );

  return result.rows[0];
}

export { fetchUserByEmail, registerUser };
