/**
 * Thin Sentry wrapper for the Next.js app.
 * No-ops when NEXT_PUBLIC_SENTRY_DSN (or SENTRY_DSN) is unset.
 */

const dsn =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  process.env.SENTRY_DSN ??
  '';

export function isSentryEnabled(): boolean {
  return Boolean(dsn);
}

export async function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  if (!dsn) return;
  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } catch {
    // Package missing or init failed — swallow to avoid cascading errors
  }
}

export async function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): Promise<void> {
  if (!dsn) return;
  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureMessage(message, level);
  } catch {
    // no-op
  }
}
