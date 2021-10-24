import connection from "../database.js";
import { entrySchema } from "../schemas.js";

async function insertEntry(req, res) {
  if (entrySchema.validate(req.body).error || !req.headers.authorization) {
    return res.sendStatus(403);
  }
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const result = await connection.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );
    if (result.rowCount === 0) {
      return res.sendStatus(401);
    }
    const { value, description } = req.body;
    const date = new Date();
    const user_id = result.rows[0].user_id;
    await connection.query(
      `INSERT INTO entries (user_id, date, value, description) VALUES ($1, $2, $3, $4);`,
      [user_id, date, value, description]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function getEntries(req, res) {
  if (!req.headers.authorization) {
    return res.sendStatus(403);
  }

  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await connection.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );
    if (user.rowCount === 0) {
      return res.sendStatus(401);
    }
    const user_id = user.rows[0].user_id;
    const entries = await connection.query(
      `SELECT * FROM entries WHERE user_id=$1;`,
      [user_id]
    );
    let balance = 0;
    entries.rows.forEach((row) => {
      balance += Number(row.value);
    });
    const response = {
      entries: entries.rows,
      balance,
    };
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { insertEntry, getEntries };
