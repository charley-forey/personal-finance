import { isProduction } from './env.util';

/** Keys required in every environment for the API to boot safely. */
const ALWAYS_REQUIRED = ['DATABASE_URL'] as const;

/**
 * Auth / crypto keys required in production. In development these may be
 * absent when using `dev:` tokens, but production must fail fast.
 */
const PRODUCTION_REQUIRED = [
  'WORKOS_CLIENT_ID',
  'WORKOS_API_KEY',
  'TOKEN_ENCRYPTION_KEY',
  'TOKEN_ENCRYPTION_SALT',
] as const;

/**
 * Validates process env at boot. Throws if required keys are missing.
 * Call before NestFactory.create so misconfiguration never serves traffic.
 */
export function validateEnv(env: NodeJS.ProcessEnv = process.env): void {
  const missing: string[] = [];

  for (const key of ALWAYS_REQUIRED) {
    if (!env[key]?.trim()) missing.push(key);
  }

  if (isProduction() || env.REQUIRE_FULL_ENV === 'true') {
    for (const key of PRODUCTION_REQUIRED) {
      if (!env[key]?.trim()) missing.push(key);
    }
  }

  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        `See .env.example for expected key names.`,
    );
  }
}
