'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { usePlaidItems } from '@/hooks/use-finance';
import { useEventStreamStatus } from '@/hooks/use-event-stream';
import { Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function isStale(lastSyncedAt?: string) {
  if (!lastSyncedAt) return true;
  const age = Date.now() - new Date(lastSyncedAt).getTime();
  return age > 36 * 60 * 60 * 1000;
}

export function SyncHealthBanner() {
  const { data: items } = usePlaidItems();
  const { connected, reconnecting } = useEventStreamStatus();
  const qc = useQueryClient();
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const problemItems =
    items?.filter(
      (i) =>
        i.loginRequired ||
        i.syncStatus === 'error' ||
        i.syncStatus === 'failed' ||
        Boolean(i.errorCode) ||
        isStale(i.lastSyncedAt),
    ) ?? [];

  const showSse = !connected;
  if (problemItems.length === 0 && !showSse) return null;

  const primary = problemItems[0];

  return (
    <div
      role="status"
      className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {showSse && problemItems.length === 0 ? (
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          {showSse && (
            <p className="font-medium text-amber-100">
              {reconnecting ? 'Reconnecting to live updates…' : 'Live updates disconnected'}
            </p>
          )}
          {primary && (
            <p className="font-medium text-amber-100">
              {primary.loginRequired
                ? `${primary.institutionName ?? 'A bank'} needs reconnection`
                : primary.syncStatus === 'error' || primary.errorCode
                  ? `Sync issue with ${primary.institutionName ?? 'a linked account'}`
                  : `${primary.institutionName ?? 'Account'} data may be stale`}
            </p>
          )}
          {problemItems.length > 1 && (
            <p className="text-amber-200/80 text-xs mt-1">{problemItems.length} institutions need attention</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        {primary?.loginRequired ? (
          <Link
            href="/app/accounts"
            className="inline-flex h-8 items-center rounded-md border border-card-border bg-card px-3 text-xs hover:bg-white/5"
          >
            Reconnect
          </Link>
        ) : primary ? (
          <Button
            size="sm"
            variant="secondary"
            disabled={syncingId === primary.id}
            onClick={async () => {
              setSyncingId(primary.id);
              try {
                await api.triggerSync(primary.id);
                await qc.invalidateQueries({ queryKey: ['plaid-items'] });
              } finally {
                setSyncingId(null);
              }
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync now
          </Button>
        ) : null}
        <Link
          href="/app/accounts"
          className="inline-flex h-8 items-center rounded-md px-3 text-xs text-muted hover:text-foreground hover:bg-white/5"
        >
          View accounts
        </Link>
      </div>
    </div>
  );
}
