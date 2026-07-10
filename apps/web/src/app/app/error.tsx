'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/sentry';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app-route-error]', error);
    void captureException(error, { digest: error.digest, boundary: 'app/app/error' });
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold">This page failed to load</h2>
      <p className="text-muted text-sm max-w-md">
        Something went wrong while loading this section. Your data is safe — try again or navigate elsewhere.
      </p>
      {error.digest && <p className="text-xs text-muted font-mono">Ref: {error.digest}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" onClick={() => { window.location.href = '/app'; }}>
          Back to Command
        </Button>
      </div>
    </div>
  );
}
