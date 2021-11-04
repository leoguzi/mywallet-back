import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import app from '../src/app.js';
import connection from '../src/database.js';
import createUser from './userFactory.js';
import createSession from './sessionFactory.js';
import createEntry from './entriesFactory.js';

let user = {};
let session = {};
let newEntry = {};
let config = {};

async function prepareDatabase() {
  user = await createUser();
  session = await createSession(user);
  config = {
    Authorization: `Bearer ${session.token}`,
  };
  newEntry = {
    value: ((Math.random() * 2 - 1 + 1) * 10000).toFixed(0),
    description: faker.lorem.words(3),
  };
}

async function clearDatabase() {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM entries;');
  await connection.query('DELETE FROM users;');
}

describe('POST /entries', () => {
  beforeEach(async () => {
    await prepareDatabase();
  });

  it('Returns 400 if no token', async () => {
    const result = await supertest(app).post('/entries').send(newEntry);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid body!' });
  });

  it('Returns 401 if invalid token', async () => {
    config.Authorization = `Bearer ${uuid()}`;
    const result = await supertest(app)
      .post('/entries')
      .set(config)
      .send(newEntry);
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ message: 'Not logged in!' });
  });

  it('Returns 400 if invalid body', async () => {
    delete newEntry.value;
    const result = await supertest(app)
      .post('/entries')
      .set(config)
      .send(newEntry);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid body!' });
  });

  it('Returns 201 for insertion success', async () => {
    const result = await supertest(app)
      .post('/entries')
      .set(config)
      .send(newEntry);
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ message: 'Created!' });
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

describe('GET /entries', () => {
  beforeEach(async () => {
    await prepareDatabase();
  });

  it('Returns 400 if no token', async () => {
    const result = await supertest(app).get('/entries');
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid token!' });
  });

  it('Returns 401 if invalid token', async () => {
    config.Authorization = `Bearer ${uuid()}`;
    const result = await supertest(app).get('/entries').set(config);
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ message: 'Not logged in!' });
  });

  it('Returns a list of entries if valid token', async () => {
    const entry = await createEntry(user.id);
    const result = await supertest(app).get('/entries').set(config);
    expect(result.status).toEqual(200);
    result.body.entries[0].date = new Date(result.body.entries[0].date);

    expect(result.body).toEqual({
      entries: [
        {
          id: entry.id,
          date: entry.date,
          description: entry.description,
          user_id: entry.user_id,
          value: entry.value,
        },
      ],
      balance: parseInt(entry.value, 10),
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

afterAll(async () => {
  await connection.end();
});
