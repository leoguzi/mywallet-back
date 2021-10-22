import connection from "../database.js";
import bcrypt from "bcrypt";
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
      [name, email, encriptedPassword]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { registerUser };
