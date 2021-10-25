import server from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database.js";
import bcrypt from "bcrypt";

const encriptedPassword = bcrypt.hashSync("testpassword", 10);

const userData = {
  name: "Testing Registration",
  email: "test@test.com",
  password: encriptedPassword,
  passwordConfirm: encriptedPassword,
};

async function createUser() {
  await connection.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [userData.name, userData.email, userData.password]
  );
}

describe("POST /register", () => {
  afterEach(async () => {
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1;`,
      [userData.email]
    );
    const id = result.rows[0]?.id;

    await connection.query(`DELETE FROM users WHERE id = $1;`, [id]);
    await connection.query(`DELETE FROM sessions WHERE user_id = $1;`, [id]);
  });

  it("Returns 201 if sucess", async () => {
    const result = await supertest(server).post("/register").send(userData);
    expect(result.status).toEqual(201);
  });

  it("Registers the user in the database", async () => {
    createUser();
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1;`,
      [userData.email]
    );
    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      name: userData.name,
      email: userData.email,
      password: expect.any(String),
    });
  });

  it("Returns 409 if e-mail already used", async () => {
    createUser();
    const result = await supertest(server).post("/register").send(userData);
    expect(result.status).toEqual(409);
  });

  it("Returns 400 if invalid body", async () => {
    const invaliduserData = {
      name: "",
      email: "test@test.com",
      password: encriptedPassword,
      passwordConfirm: encriptedPassword,
    };

    const result = await supertest(server)
      .post("/register")
      .send(invaliduserData);
    expect(result.status).toEqual(400);
  });
});

describe("POST /login", () => {
  afterEach(async () => {
    const result = await connection.query(
      `SELECT * FROM users WHERE email = $1;`,
      [userData.email]
    );
    const id = result.rows[0]?.id;

    await connection.query(`DELETE FROM users WHERE id = $1;`, [id]);
    await connection.query(`DELETE FROM sessions WHERE user_id = $1;`, [id]);
  });

  it("Returns 404 if user not found", async () => {
    createUser();
    const invalidLoginData = {
      email: "notregistred@test.com",
      password: "testpassword",
    };
    const result = await supertest(server)
      .post("/login")
      .send(invalidLoginData);
    expect(result.status).toEqual(404);
  });

  it("Returns 401 if wrong password", async () => {
    createUser();
    const invalidLoginData = {
      email: "test@test.com",
      password: "wrongpassword",
    };
    const result = await supertest(server)
      .post("/login")
      .send(invalidLoginData);
    expect(result.status).toEqual(401);
  });

  it("Returns 200 if logged in sucessfully", async () => {
    createUser();
    const validLoginData = {
      email: "test@test.com",
      password: "testpassword",
    };

    const result = await supertest(server).post("/login").send(validLoginData);
    expect(result.status).toEqual(200);
  });

  /* it("Creates a session in the database", async () => {
    createUser();
    const validLoginData = {
      email: "test@test.com",
      password: "testpassword",
    };

    let createdUser = await connection.query(
      `SELECT * FROM users WHERE password = $1;`,
      [userData.password]
    );
    await supertest(server).post("/login").send(validLoginData);
    const session = await connection.query(
      `SELECT * FROM sessions WHERE user_id = $1;`,
      [createdUser.rows[0].id]
    );
    expect(session.rowCount).toEqual(1);
  });*/
});

describe("POST /logout", () => {
  it("Returns 404 session not found", async () => {
    const result = await supertest(server)
      .post("/logout")
      .send({ token: "asdlasdçlaskdaçlsdkaçsldk" });
    expect(result.status).toEqual(404);
  });

  /* it("Returns 200 if logout was sucessful", async () => {
    createUser();
    const validLoginData = {
      email: "test@test.com",
      password: "testpassword",
    };
    let createdUser = await connection.query(
      `SELECT * FROM users WHERE password = $1;`,
      [userData.password]
    );
    await supertest(server).post("/login").send(validLoginData);

    const session = await connection.query(
      `SELECT * FROM sessions WHERE user_id = $1;`,
      [createdUser.rows[0].id]
    );
    const token = session.rows[0].token;
    const result = await supertest(server).post("/logout").send({ token });
    expect(result.status).toEqual(200);
  }); */
});
