import server from "../src/app/app.js";
import supertest from "supertest";

describe("POST /entries", () => {
  it("Returns 403 if no token", async () => {
    const body = {
      value: 35000,
      description: "Hello I'm a test case :)",
    };

    const result = await (await supertest(server).post("/entries")).send(body);
    expect(result.status).toEqual(403);
  });
  it("Returns 401 if invalid token", async () => {
    const config = {
      Authorization: "Bearer ",
    };

    const body = {
      value: 35000,
      description: "Hello I'm a test case :)",
    };

    const result = await (await supertest(server).post("/entries"))
      .set(config)
      .send(body);
    expect(result.status).toEqual(401);
  });

  it("Returns 403 if invalid body", async () => {
    const config = {
      Authorization: "Bearer e4eba2cb-a7e1-4d81-a1b2-f1615a036410",
    };

    const body = {
      value: 35000,
    };

    const result = await (await supertest(server).post("/entries"))
      .set(config)
      .send(body);
    expect(result.status).toEqual(403);
  });

  it("Returns 201 for insertion success", async () => {
    const config = {
      Authorization: "Bearer e4eba2cb-a7e1-4d81-a1b2-f1615a036410",
    };

    const body = {
      value: 35000,
      description: "Hello, I'm a test case insertion!",
    };

    const result = await (await supertest(server).post("/entries"))
      .set(config)
      .send(body);
    expect(result.status).toEqual(201);
  });
});
