'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminTrustPage() {
  const [q, setQ] = useState('');
  const audit = useQuery({ queryKey: ['admin-audit', q], queryFn: () => adminApi.adminAudit(q || undefined) });
  const dsar = useQuery({ queryKey: ['admin-dsar'], queryFn: () => adminApi.dsarList() });
  const access = useQuery({ queryKey: ['admin-access'], queryFn: () => adminApi.accessReview() });
  const sso = useQuery({ queryKey: ['admin-sso'], queryFn: () => adminApi.sso() });
  const [orgId, setOrgId] = useState('');
  const [userId, setUserId] = useState('');

  if (audit.isLoading) return <PageLoading />;
  if (audit.isError) return <PageError message={(audit.error as Error).message} onRetry={() => audit.refetch()} />;

  return (
    <div className="space-y-6">
      <AppPageHeader title="Trust & Compliance" description="Admin audit, DSAR, access reviews, SSO status, evidence packs." />

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">DSAR workspace</h3>
        <div className="flex flex-wrap gap-2">
          <Input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="Org ID" />
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID (delete)" />
          <Button
            size="sm"
            onClick={async () => {
              if (!orgId) return;
              await adminApi.createDsar({ orgId, requestType: 'export', reason: 'support export' });
              dsar.refetch();
            }}
          >
            Request export
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              if (!orgId || !userId) return;
              await adminApi.createDsar({ orgId, userId, requestType: 'delete', reason: 'gdpr delete' });
              dsar.refetch();
            }}
          >
            Request delete
          </Button>
        </div>
        <ul className="text-sm space-y-2">
          {(dsar.data ?? []).map((d) => (
            <li key={String(d.id)} className="flex flex-wrap items-center gap-2 justify-between border-b border-border/40 pb-2">
              <span>
                <Badge>{String(d.requestType)}</Badge> {String(d.status)} · org {String(d.orgId)}
              </span>
              <span className="flex gap-1">
                {d.status === 'pending' && (
                  <Button size="sm" variant="ghost" onClick={() => adminApi.approveDsar(String(d.id)).then(() => dsar.refetch())}>
                    Approve
                  </Button>
                )}
                {(d.status === 'approved' || d.requestType === 'export') && d.status !== 'completed' && (
                  <Button size="sm" variant="secondary" onClick={() => adminApi.executeDsar(String(d.id)).then(() => dsar.refetch())}>
                    Execute
                  </Button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex gap-2 items-center justify-between">
          <h3 className="font-medium">Admin audit</h3>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" className="max-w-xs" />
        </div>
        <ul className="text-sm space-y-2 max-h-96 overflow-auto">
          {(audit.data?.results ?? []).map((r) => (
            <li key={String(r.id)} className="border-b border-border/40 pb-2">
              <strong>{String(r.action)}</strong> by {String(r.actorEmail)}
              {r.reason ? ` — ${String(r.reason)}` : ''}
              <div className="text-xs text-muted">{r.createdAt ? new Date(String(r.createdAt)).toLocaleString() : ''}</div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Access review</h3>
          <pre className="text-xs overflow-auto text-muted">{JSON.stringify(access.data, null, 2)}</pre>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-medium">SSO / SCIM</h3>
          <pre className="text-xs overflow-auto text-muted">{JSON.stringify(sso.data, null, 2)}</pre>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              const pack = await adminApi.evidencePack();
              const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'evidence-pack.json';
              a.click();
            }}
          >
            Download evidence pack
          </Button>
        </Card>
      </div>
    </div>
  );
}
