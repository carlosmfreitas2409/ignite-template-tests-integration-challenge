import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show user profile', async () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };

    await request(app).post('/api/v1/users').send(user);

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    const { token, user: userAuthenticated } = responseToken.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(userAuthenticated.id);
  });
});
