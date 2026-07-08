'use client';

import { useEffect, useState } from 'react';
import { useAuth, useAccessToken } from '@workos-inc/authkit-nextjs/components';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getAccessToken, loading: tokenLoading } = useAccessToken();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (authLoading || tokenLoading) return;

      if (!user) {
        router.replace('/login');
        return;
      }

      const token = await getAccessToken();
      if (cancelled || !token) return;
      setAuthToken(token);
      setReady(true);
    }

    sync();
    return () => {
      cancelled = true;
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
