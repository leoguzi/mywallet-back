import connection from "../database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { userSchema } from "../schemas.js";

async function registerUser(req, res) {
  if (userSchema.validate(req.body).error) {
    return res.sendStatus(400);
  }
  const { name, email } = req.body;
  const encriptedPassword = bcrypt.hashSync(req.body.password, 10);

  try {
    const user = await connection.query(`SELECT * FROM users WHERE email=$1;`, [
      email,
    ]);
    if (user.rowCount > 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email.toLowerCase(), encriptedPassword]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;
  try {
    let user = await connection.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);
    if (user.rowCount === 0) {
      return res.sendStatus(404);
    }
    user = user.rows[0];

    if (bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await connection.query(
        `INSERT INTO sessions (user_id, token) VALUES ($1, $2);`,
        [user.id, token]
      );

      return res.send({ name: user.name, token });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logOut(req, res) {
  const { token } = req.body;
  try {
    const response = await connection.query(
      `DELETE FROM sessions WHERE token = $1;`,
      [token]
    );
    if (response.rowCount === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { registerUser, logIn, logOut };
