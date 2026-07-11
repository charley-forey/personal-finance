'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminFlagsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-flags'],
    queryFn: () => adminApi.flags(),
  });
  const [reason, setReason] = useState('ops toggle');

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError message={(error as Error).message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <AppPageHeader title="Feature flags" description="Global toggles and org overrides. Kill switches live under Reliability." />
      <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Change reason" />
      <Card className="divide-y divide-border">
        {(data ?? []).map((f) => (
          <div key={String(f.key)} className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium flex items-center gap-2">
                {String(f.key)}
                <Badge variant={f.enabled ? 'success' : 'default'}>{f.enabled ? 'on' : 'off'}</Badge>
                <Badge variant="default">{String(f.source)}</Badge>
              </div>
              <p className="text-xs text-muted mt-1">
                Overrides: {Object.keys((f.orgOverridesJson as Record<string, boolean>) ?? {}).length}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await adminApi.upsertFlag({
                  key: String(f.key),
                  enabled: !f.enabled,
                  orgOverrides: (f.orgOverridesJson as Record<string, boolean>) ?? {},
                  reason,
                });
                refetch();
              }}
            >
              Toggle
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
