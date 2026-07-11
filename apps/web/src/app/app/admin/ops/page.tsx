'use client';

import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminOpsPage() {
  const queues = useQuery({ queryKey: ['admin-queues'], queryFn: () => adminApi.queues() });
  const kills = useQuery({ queryKey: ['admin-kills'], queryFn: () => adminApi.killSwitches() });
  const plaid = useQuery({ queryKey: ['admin-plaid'], queryFn: () => adminApi.plaidHealth() });
  const health = useQuery({ queryKey: ['admin-ops-health'], queryFn: () => adminApi.deepHealth() });

  if (queues.isLoading) return <PageLoading />;
  if (queues.isError) return <PageError message={(queues.error as Error).message} onRetry={() => queues.refetch()} />;

  const queueList = ((queues.data?.queues as Array<Record<string, unknown>>) ?? []);

  return (
    <div className="space-y-6">
      <AppPageHeader title="Reliability" description="Queues, kill switches, Plaid health, incident mode." />

      <div className="flex flex-wrap gap-2">
        <Badge variant={queues.data?.available ? 'success' : 'warning'}>
          Redis {queues.data?.available ? 'up' : 'degraded'}
        </Badge>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            const reason = prompt('Reason for enabling incident mode?');
            if (!reason) return;
            await adminApi.incident(true, reason);
            alert('Incident mode enabled (AI flags off).');
          }}
        >
          Enable incident mode
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={async () => {
            await adminApi.incident(false, 'clear incident');
            alert('Incident mode cleared.');
          }}
        >
          Clear incident
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Kill switches (process env)</h3>
        <ul className="space-y-2 text-sm">
          {(kills.data ?? []).map((k) => (
            <li key={String(k.key)} className="flex justify-between gap-2">
              <span>
                <strong>{String(k.label)}</strong> — {String(k.description)}
              </span>
              <Badge variant={k.enabled ? 'success' : 'danger'}>{k.enabled ? 'enabled' : 'KILLED'}</Badge>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">Changing env kill switches requires a process restart.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {queueList.map((q) => (
          <Card key={String(q.name)} className="p-4 space-y-2">
            <h3 className="font-medium">{String(q.name)}</h3>
            <p className="text-sm text-muted">
              waiting {String(q.waiting)} · active {String(q.active)} · failed {String(q.failed)} · delayed {String(q.delayed)}
            </p>
            <ul className="text-xs space-y-1 max-h-40 overflow-auto">
              {((q.deadLetters as Array<Record<string, unknown>>) ?? []).map((j) => (
                <li key={String(j.id)} className="flex justify-between gap-2">
                  <span className="truncate">{String(j.id)} — {String(j.failedReason ?? '')}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => adminApi.redrive(String(q.name), String(j.id)).then(() => queues.refetch())}
                  >
                    Redrive
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Broken Plaid connections</h3>
        <p className="text-sm text-muted">Pending webhooks: {plaid.data?.pendingWebhooks ?? 0}</p>
        <ul className="text-sm space-y-2">
          {(plaid.data?.brokenItems ?? []).map((item) => (
            <li key={String(item.id)} className="flex justify-between gap-2">
              <span>
                {String(item.institutionName)} · org {String(item.orgId)} · {String(item.syncStatus)}
              </span>
              <Button size="sm" variant="secondary" onClick={() => adminApi.forceSync(String(item.id))}>
                Force sync
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-2">Deep health</h3>
        <pre className="text-xs overflow-auto text-muted">{JSON.stringify(health.data, null, 2)}</pre>
      </Card>
    </div>
  );
}
