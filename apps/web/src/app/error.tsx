'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/sentry';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app-error]', error);
    void captureException(error, { digest: error.digest, boundary: 'app/error' });
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted text-sm max-w-md">
        An unexpected error occurred. You can try again, or return to the home page.
      </p>
      {error.digest && <p className="text-xs text-muted font-mono">Ref: {error.digest}</p>}
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" onClick={() => { window.location.href = '/app'; }}>
          Go to Command
        </Button>
      </div>
    </div>
  );
}
