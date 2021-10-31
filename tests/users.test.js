import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database.js";
import createUser from "./userFactory.js";
import createSession from "./sessionFactory.js";
import faker from "faker";

describe("POST /register", () => {
  let newUser = {};
  beforeEach(() => {
    newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
      passwordConfirm: "123456",
    };
  });

  afterEach(async () => {
    await connection.query(`DELETE FROM users;`);
  });

  it("Returns 201 if the body is valid", async () => {
    const result = await supertest(app).post("/register").send(newUser);
    expect(result.status).toEqual(201);
  });

  it("Returns 409 if e-mail already used", async () => {
    const user = await createUser();
    newUser.email = user.email;
    const result = await supertest(app).post("/register").send(newUser);
    expect(result.status).toEqual(409);
  });

  it("Returns 400 if invalid body", async () => {
    delete newUser.name;
    const result = await supertest(app).post("/register").send(newUser);
    expect(result.status).toEqual(400);
  });
});

describe("POST /login", () => {
  let user = {};
  beforeEach(async () => {
    user = await createUser();
  });

  afterEach(async () => {
    await connection.query(`DELETE FROM users;`);
    await connection.query(`DELETE FROM sessions;`);
  });

  it("Returns 404 if user not found", async () => {
    const loginData = {
      email: faker.internet.email(),
      password: user.password,
    };

    const result = await supertest(app).post("/login").send(loginData);
    expect(result.status).toEqual(404);
  });

  it("Returns 401 if wrong password", async () => {
    const result = await supertest(app)
      .post("/login")
      .send({ email: user.email, password: "wrongpswd" });

    expect(result.status).toEqual(401);
  });

  it("Returns 200 if logged in sucessfully", async () => {
    const result = await supertest(app)
      .post("/login")
      .send({ email: user.email, password: user.password });
    expect(result.status).toEqual(200);
  });

  it("Creates a session in the database", async () => {
    await supertest(app)
      .post("/login")
      .send({ email: user.email, password: user.password });
    const session = await connection.query(
      `SELECT * FROM sessions WHERE user_id = $1;`,
      [user.id]
    );
    expect(session.rowCount).toEqual(1);
  });
});

describe("POST /logout", () => {
  it("Returns 404 session not found", async () => {
    const result = await supertest(app)
      .post("/logout")
      .send({ token: "invalidtoken :P" });
    expect(result.status).toEqual(404);
  });

  it("Returns 200 if logout was sucessful", async () => {
    const user = await createUser();
    const session = await createSession({ id: user.id });

    const result = await supertest(app)
      .post("/logout")
      .send({ token: session.token });
    expect(result.status).toEqual(200);
  });
});

afterAll(async () => {
  connection.end();
});
