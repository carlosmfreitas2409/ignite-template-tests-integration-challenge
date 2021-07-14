import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get user balance', async () => {
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

    const { token } = responseToken.body;

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 30,
      description: 'Freelancer'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe('Freelancer');
  });
});
