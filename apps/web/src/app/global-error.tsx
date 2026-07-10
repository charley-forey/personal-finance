'use client';

import { useEffect } from 'react';
import { captureException } from '@/lib/sentry';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
    void captureException(error, { digest: error.digest, boundary: 'global-error' });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: '#09090b', color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ color: '#71717a', fontSize: '0.875rem', maxWidth: '28rem' }}>
            A critical error occurred. Please try again.
          </p>
          {error.digest && (
            <p style={{ color: '#71717a', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#22c55e',
              color: '#09090b',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 1rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
