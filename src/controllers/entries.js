import connection from '../database.js';
import { entrySchema } from '../schemas.js';

async function insertEntry(req, res) {
  if (entrySchema.validate(req.body).error || !req.headers.authorization) {
    return res.status(400).send({ message: 'Invalid body!' });
  }
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const result = await connection.query(
      'SELECT * FROM sessions WHERE token = $1;',
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(401).send({ message: 'Not logged in!' });
    }

    const { value, description } = req.body;
    const date = new Date();
    const { userId } = result.rows[0];
    await connection.query(
      'INSERT INTO entries (user_id, date, value, description) VALUES ($1, $2, $3, $4);',
      [userId, date, value, description]
    );
    return res.status(201).send({ message: 'Created!' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function getEntries(req, res) {
  if (!req.headers.authorization) {
    return res.status(400).send({ message: 'Invalid token!' });
  }

  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = await connection.query(
      'SELECT * FROM sessions WHERE token = $1;',
      [token]
    );
    if (user.rowCount === 0) {
      return res.status(401).send({ message: 'Not logged in!' });
    }
    const userId = user.rows[0].user_id;
    const entries = await connection.query(
      'SELECT * FROM entries WHERE user_id=$1 ORDER BY id DESC;',
      [userId]
    );

    let balance = 0;
    entries.rows.forEach((row) => {
      balance += Number(row.value);
    });

    const response = {
      entries: entries.rows,
      balance,
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { insertEntry, getEntries };
