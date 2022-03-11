import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('register event', () => {
    return request(app.getHttpServer())
      .post('/api/monitor/event')
      .send({
        type: "login",
        page: "google.com",
        user: "john",
        element_id: "1234"
      })
      .expect(201);
  });

});
