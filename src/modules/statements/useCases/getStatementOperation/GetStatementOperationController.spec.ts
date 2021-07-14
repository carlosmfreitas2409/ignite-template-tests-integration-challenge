import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Get Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get statement operation', async () => {
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

    const responseStatement = await request(app).post('/api/v1/statements/deposit').send({
      amount: 30,
      description: 'Freelancer'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const statement_id = responseStatement.body.id as string;

    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.description).toBe('Freelancer');
  });
});
