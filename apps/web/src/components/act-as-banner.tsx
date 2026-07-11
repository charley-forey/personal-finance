'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { clearActAsSession, getActAsSession, type ActAsSession } from '@/lib/act-as';
import { adminApi } from '@/lib/admin-api';
import { useQueryClient } from '@tanstack/react-query';

export function ActAsBanner() {
  const [session, setSession] = useState<ActAsSession | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const sync = () => setSession(getActAsSession());
    sync();
    window.addEventListener('pf:act-as-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('pf:act-as-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!session) return null;

  return (
    <div className="border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
      <span>
        <strong>SUPPORT SESSION</strong> — viewing product as{' '}
        <span className="font-medium">{session.orgName ?? session.orgId}</span>
        {session.reason ? ` (${session.reason})` : ''}
      </span>
      <div className="flex gap-2">
        <Link href={`/app/admin/orgs/${session.orgId}`} className="underline text-xs">
          Org in Control Plane
        </Link>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            try {
              await adminApi.revokeImpersonation(session.sessionId);
            } catch {
              /* session may already be expired */
            }
            clearActAsSession();
            setSession(null);
            await queryClient.invalidateQueries();
          }}
        >
          End session
        </Button>
      </div>
    </div>
  );
}
