/**
 * Boot-time env validation unit tests (no DB required).
 */
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnv } from '../src/common/env.validation';

const ORIGINAL = { ...process.env };

describe('validateEnv', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL };
    delete process.env.REQUIRE_FULL_ENV;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('passes when DATABASE_URL is set in non-production', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://localhost/test';
    delete process.env.WORKOS_CLIENT_ID;
    assert.doesNotThrow(() => validateEnv());
  });

  it('fails when DATABASE_URL is missing', () => {
    process.env.NODE_ENV = 'test';
    delete process.env.DATABASE_URL;
    assert.throws(() => validateEnv(), /DATABASE_URL/);
  });

  it('fails fast in production without WorkOS / encryption keys', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://localhost/test';
    delete process.env.WORKOS_CLIENT_ID;
    delete process.env.WORKOS_API_KEY;
    delete process.env.TOKEN_ENCRYPTION_KEY;
    assert.throws(() => validateEnv(), /WORKOS_CLIENT_ID/);
  });
});
