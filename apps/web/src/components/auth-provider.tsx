'use client';

import { useEffect, useState } from 'react';
import { useAuth, useAccessToken } from '@workos-inc/authkit-nextjs/components';
import { useRouter } from 'next/navigation';
import { clearAuthToken, setAuthToken } from '@/lib/api';

/**
 * AuthKit access token is the source of truth. localStorage `pf_token` is a
 * short-lived cache refreshed whenever AuthKit provides a new token.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getAccessToken, loading: tokenLoading } = useAccessToken();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setInterval> | undefined;

    async function sync() {
      if (authLoading || tokenLoading) return;

      if (!user) {
        clearAuthToken();
        router.replace('/login');
        return;
      }

      const token = await getAccessToken();
      if (cancelled || !token) return;
      setAuthToken(token);
      setReady(true);
    }

    void sync();
    // Refresh cache periodically so orphaned localStorage tokens do not linger.
    refreshTimer = setInterval(() => {
      void sync();
    }, 4 * 60 * 1000);

    return () => {
      cancelled = true;
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [user, authLoading, tokenLoading, getAccessToken, router]);

  if (authLoading || tokenLoading || !ready) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted text-sm">
        Loading session...
      </div>
    );
  }

  return <>{children}</>;
}
