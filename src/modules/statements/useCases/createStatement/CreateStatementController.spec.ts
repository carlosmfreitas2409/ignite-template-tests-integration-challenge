import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new deposit statement', async () => {
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

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 10,
      description: 'Freelancer'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  });

  it('should be able to create a new withdraw statement', async () => {
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
      amount: 20,
      description: 'Freelancer'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 10,
      description: 'Compras'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  });
});
