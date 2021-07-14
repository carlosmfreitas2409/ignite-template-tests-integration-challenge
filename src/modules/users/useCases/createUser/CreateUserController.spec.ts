import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
  });
});
