import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database.js";

const body = {
  value: 35000,
  description: "Hello, I'm a test case :)",
};

const config = {
  Authorization: "Bearer iamafalsetokenjustfortests:)",
};

async function createSession() {
  await connection.query(
    `INSERT INTO sessions (user_id, token) VALUES ($1, $2)`,
    [0, "iamafalsetokenjustfortests:)"]
  );
}

afterAll(() => {
  connection.end();
});

describe("POST /entries", () => {
  afterEach(async () => {
    await connection.query(`DELETE FROM entries WHERE user_id = $1;`, [0]);
    await connection.query(`DELETE FROM sessions WHERE user_id = $1`, [0]);
  });

  it("Returns 403 if no token", async () => {
    createSession();
    const result = await supertest(app).post("/entries").send(body);
    expect(result.status).toEqual(403);
  });

  it("Returns 401 if invalid token", async () => {
    const result = await supertest(app).post("/entries").set(config).send(body);
    expect(result.status).toEqual(401);
  });

  it("Returns 403 if invalid body", async () => {
    createSession();
    const invalidBody = {
      value: 35000,
    };

    const result = await supertest(app)
      .post("/entries")
      .set(config)
      .send(invalidBody);
    expect(result.status).toEqual(403);
  });

  it("Returns 201 for insertion success", async () => {
    createSession();

    const result = await supertest(app).post("/entries").set(config).send(body);
    expect(result.status).toEqual(201);
  });
});

describe("GET /entries", () => {
  afterEach(async () => {
    await connection.query(`DELETE FROM entries WHERE user_id = $1;`, [0]);
    await connection.query(`DELETE FROM sessions WHERE user_id = $1`, [0]);
  });

  it("Returns 403 if no token", async () => {
    createSession();
    const result = await supertest(app).get("/entries");
    expect(result.status).toEqual(403);
  });

  it("Returns 401 if invalid token", async () => {
    createSession();
    const config = {
      Authorization: "Bearer tesettetaslkdflsdjaslkdj",
    };
    const result = await supertest(app).get("/entries").set(config);
    expect(result.status).toEqual(401);
  });

  it("Returns 200 if valid token", async () => {
    createSession();
    const result = await supertest(app).get("/entries").set(config);
    expect(result.status).toEqual(200);
  });
});
