'use client';

import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Button, Badge, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';
import { useState } from 'react';

export default function AdminScalePage() {
  const firms = useQuery({ queryKey: ['admin-firms'], queryFn: () => adminApi.firms() });
  const keys = useQuery({ queryKey: ['admin-keys'], queryFn: () => adminApi.apiKeys() });
  const webhooks = useQuery({ queryKey: ['admin-webhooks'], queryFn: () => adminApi.webhooks() });
  const experiments = useQuery({ queryKey: ['admin-experiments'], queryFn: () => adminApi.experiments() });
  const admins = useQuery({ queryKey: ['admin-admins'], queryFn: () => adminApi.listAdmins() });
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('readonly_analyst');

  if (firms.isLoading) return <PageLoading />;
  if (firms.isError) return <PageError message={(firms.error as Error).message} />;

  return (
    <div className="space-y-6">
      <AppPageHeader title="Scale" description="Advisor firms, API keys, webhooks, experiments, warehouse, platform admins." />

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Platform admins</h3>
        <div className="flex flex-wrap gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@…" />
          <select
            className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="platform_owner">platform_owner</option>
            <option value="platform_admin">platform_admin</option>
            <option value="support_agent">support_agent</option>
            <option value="billing_ops">billing_ops</option>
            <option value="eng_ops">eng_ops</option>
            <option value="security_compliance">security_compliance</option>
            <option value="readonly_analyst">readonly_analyst</option>
          </select>
          <Button
            onClick={async () => {
              if (!email) return;
              await adminApi.upsertAdmin(email, role);
              setEmail('');
              admins.refetch();
            }}
          >
            Upsert
          </Button>
        </div>
        <ul className="text-sm space-y-1">
          {(admins.data ?? []).map((a) => (
            <li key={String(a.id)}>
              {String(a.email)} · <Badge>{String(a.role)}</Badge> · {a.active ? 'active' : 'inactive'}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Advisor firms</h3>
          <pre className="text-xs text-muted overflow-auto max-h-64">{JSON.stringify(firms.data, null, 2)}</pre>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">API key abuse signals</h3>
          <p className="text-sm mb-2">Total {String(keys.data?.total ?? 0)} · Stale 90d {((keys.data?.stale90d as unknown[]) ?? []).length}</p>
          <pre className="text-xs text-muted overflow-auto max-h-64">{JSON.stringify({ adminScoped: keys.data?.adminScoped, stale90d: keys.data?.stale90d }, null, 2)}</pre>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Webhooks</h3>
          <pre className="text-xs text-muted overflow-auto max-h-64">{JSON.stringify(webhooks.data, null, 2)}</pre>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Experiments / exposures</h3>
          <pre className="text-xs text-muted overflow-auto max-h-64">{JSON.stringify(experiments.data, null, 2)}</pre>
        </Card>
      </div>

      <Button
        onClick={async () => {
          const snap = await adminApi.warehouseExport();
          alert(`Warehouse snapshot saved for ${String(snap.date)}`);
        }}
      >
        Export warehouse snapshot
      </Button>
    </div>
  );
}
