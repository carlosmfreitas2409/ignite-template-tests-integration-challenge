import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate user', async () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };

    await request(app).post('/api/v1/users').send(user);

    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});
