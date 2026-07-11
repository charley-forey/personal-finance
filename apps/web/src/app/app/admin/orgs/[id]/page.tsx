'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';
import { setActAsSession } from '@/lib/act-as';

export default function AdminOrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-org', id],
    queryFn: () => adminApi.org(id),
  });
  const timeline = useQuery({
    queryKey: ['admin-org-timeline', id],
    queryFn: () => adminApi.orgTimeline(id),
  });
  const [plan, setPlan] = useState('pro');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  if (isLoading) return <PageLoading variant="cards" />;
  if (isError || !data) return <PageError message={(error as Error)?.message ?? 'Not found'} onRetry={() => refetch()} />;

  const org = data.org as Record<string, unknown>;
  const usage = data.usage as Record<string, unknown>;
  const ai = data.ai as Record<string, unknown>;
  const members = (data.members as Array<Record<string, unknown>>) ?? [];
  const items = (data.plaidItems as Array<Record<string, unknown>>) ?? [];

  return (
    <div className="space-y-6">
      <AppPageHeader
        title={String(org.name)}
        description={`Customer 360 · ${id}`}
      />

      <div className="flex flex-wrap gap-2">
        <Badge>{String(org.planTier)}</Badge>
        <Badge variant={org.status === 'active' ? 'success' : 'warning'}>{String(org.status)}</Badge>
        {org.stripeCustomerId ? (
          <Badge variant="default">Stripe {String(org.stripeCustomerId)}</Badge>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 space-y-2">
          <h3 className="font-medium">Usage</h3>
          <pre className="text-xs overflow-auto text-muted">{JSON.stringify(usage, null, 2)}</pre>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-medium">AI</h3>
          <pre className="text-xs overflow-auto text-muted">{JSON.stringify(ai, null, 2)}</pre>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-medium">Counts</h3>
          <p className="text-sm">Accounts: {String(data.accountCount)}</p>
          <p className="text-sm">Documents: {String(data.documentCount)}</p>
          <p className="text-sm">Plaid items: {items.length}</p>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Control</h3>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs text-muted block mb-1">Plan</label>
            <select
              className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="free">free</option>
              <option value="pro">pro</option>
              <option value="family">family</option>
              <option value="advisor">advisor</option>
            </select>
          </div>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (required)" className="min-w-64" />
          <Button
            disabled={busy || !reason.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                await adminApi.updatePlan(id, plan, reason);
                await refetch();
              } finally {
                setBusy(false);
              }
            }}
          >
            Set plan
          </Button>
          <Button
            variant="secondary"
            disabled={busy || !reason.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                await adminApi.updateStatus(id, org.status === 'suspended' ? 'active' : 'suspended', reason);
                await refetch();
              } finally {
                setBusy(false);
              }
            }}
          >
            {org.status === 'suspended' ? 'Activate' : 'Suspend'}
          </Button>
          <Button
            variant="secondary"
            disabled={busy || !reason.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                const res = (await adminApi.impersonate(id, reason)) as {
                  session: { id: string; expiresAt: string };
                  banner?: string;
                };
                setActAsSession({
                  sessionId: res.session.id,
                  orgId: id,
                  orgName: String(org.name),
                  expiresAt: String(res.session.expiresAt),
                  reason,
                });
                router.push('/app');
              } finally {
                setBusy(false);
              }
            }}
          >
            View as this org
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Members</h3>
        <ul className="space-y-2 text-sm">
          {members.map((m) => (
            <li key={String(m.userId)} className="flex flex-wrap items-center gap-2 justify-between border-b border-border/40 pb-2">
              <span>{String(m.email)} · <Badge>{String(m.role)}</Badge></span>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  const next = m.role === 'viewer' ? 'admin' : 'viewer';
                  const r = prompt('Reason for role change?');
                  if (!r) return;
                  await adminApi.updateMemberRole(id, String(m.userId), next, r);
                  refetch();
                }}
              >
                Toggle role
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Plaid (no tokens)</h3>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={String(item.id)} className="flex justify-between gap-2">
              <span>
                {String(item.institutionName ?? 'Unknown')} · {String(item.syncStatus)}
                {item.loginRequired ? ' · login_required' : ''}
              </span>
              <Button size="sm" variant="secondary" onClick={() => adminApi.forceSync(String(item.id)).then(() => refetch())}>
                Force sync
              </Button>
            </li>
          ))}
          {items.length === 0 && <p className="text-muted">No linked items</p>}
        </ul>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Support note</h3>
        <div className="flex gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" />
          <Button
            onClick={async () => {
              if (!note.trim()) return;
              await adminApi.addNote(id, note);
              setNote('');
              refetch();
            }}
          >
            Add
          </Button>
        </div>
        <ul className="text-sm space-y-1">
          {((data.supportNotes as Array<Record<string, unknown>>) ?? []).map((n) => (
            <li key={String(n.id)} className="text-muted">
              <strong className="text-foreground">{String(n.authorEmail)}</strong>: {String(n.body)}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Timeline</h3>
        <ul className="text-sm space-y-2 max-h-80 overflow-auto">
          {(timeline.data?.events ?? []).map((e, i) => (
            <li key={i} className="border-b border-border/40 pb-2">
              <Badge variant="default">{String(e.type)}</Badge>{' '}
              <span>{String(e.summary)}</span>
              <div className="text-xs text-muted">{e.at ? new Date(String(e.at)).toLocaleString() : ''}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
