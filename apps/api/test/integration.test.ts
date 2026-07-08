import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';

loadEnv({ path: resolve(__dirname, '../../../.env') });

process.env.NODE_ENV = 'test';
process.env.TOKEN_ENCRYPTION_KEY =
  process.env.TOKEN_ENCRYPTION_KEY ?? 'test-encryption-key-32-chars-min!!';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/personal_finance';
}
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = 'redis://localhost:6379';
}

let app: INestApplication;

before(async () => {
  app = await NestFactory.create(TestAppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.init();
});

after(async () => {
  await app?.close();
});

describe('GET /health', () => {
  it('returns ok status', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'personal-finance-api');
  });
});

describe('POST /auth/session', () => {
  it('creates a dev session in test env', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/session')
      .send({
        workosUserId: `test-user-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        name: 'Integration Test User',
      })
      .expect(201);

    assert.ok(res.body.token);
    assert.ok(res.body.token.startsWith('dev:'));
    assert.ok(res.body.user?.id);
    assert.match(res.body.user.email, /@example\.com$/);
  });
});

describe('GET /accounts', () => {
  it('returns accounts with dev token', async () => {
    const session = await request(app.getHttpServer())
      .post('/auth/session')
      .send({
        workosUserId: `accounts-user-${Date.now()}`,
        email: `accounts-${Date.now()}@example.com`,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/accounts')
      .set('Authorization', `Bearer ${session.body.token}`)
      .expect(200);

    assert.ok(Array.isArray(res.body));
  });
});
