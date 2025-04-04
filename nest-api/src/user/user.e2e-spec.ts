import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { User } from './entities/user.entity';
import { setEmailAsVerified } from 'test/utils/verification-request.utils';

describe('User Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  it('/user (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      cpf: '12350807061',
      phone: '123456789',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      created_at: expect.any(String),
      updated_at: expect.any(String),
      email_verified_at: null,
    });
  });

  it('/user (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/user').query({
      limit: 10,
      init: 0,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      results: expect.any(Array) as User[],
      total: expect.any(Number),
      limit: 10,
      init: 0,
    });
  });

  it('/user (GET)', async () => {
    await setEmailAsVerified('john.doe@example.com');

    const tokenResponse = await request(app.getHttpServer())
      .post('/auth/user')
      .send({
        email: 'john.doe@example.com',
        password: 'password',
      });

    const response = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${tokenResponse.body.access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      image: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      email_verified_at: expect.any(String),
      deleted_at: null,
      cpf: '12350807061',
    });
  });
});
