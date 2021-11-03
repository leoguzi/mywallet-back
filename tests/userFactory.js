import connection from "../src/database";
import faker from "faker";
import bcrypt from "bcrypt";

export default async function createUser() {
  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: "123456",
    passwordConfirm: "123456",
    hashedPassword: bcrypt.hashSync("123456", 10),
  };

  const insertedUser = await connection.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
    [userData.name, userData.email, userData.hashedPassword]
  );

  userData.id = insertedUser.rows[0].id;
  return userData;
}
