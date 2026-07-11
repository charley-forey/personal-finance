'use client';

import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminBillingPage() {
  const subs = useQuery({ queryKey: ['admin-subs'], queryFn: () => adminApi.subscriptions() });
  const pastDue = useQuery({ queryKey: ['admin-past-due'], queryFn: () => adminApi.subscriptions('past_due') });
  const outliers = useQuery({ queryKey: ['admin-outliers'], queryFn: () => adminApi.outliers() });

  if (subs.isLoading) return <PageLoading variant="table" />;
  if (subs.isError) return <PageError message={(subs.error as Error).message} onRetry={() => subs.refetch()} />;

  const rows = ((subs.data?.data as Array<Record<string, unknown>>) ?? []);

  return (
    <div className="space-y-6">
      <AppPageHeader title="FinOps" description="Subscriptions, dunning, usage outliers, Stripe deep-links." />
      <div className="flex gap-3 text-sm">
        <Badge>Page MRR est. ${String(subs.data?.pageMrrEstimate ?? 0)}</Badge>
        <Badge variant="warning">Past due {((pastDue.data?.data as unknown[]) ?? []).length}</Badge>
        <Badge variant="danger">Outliers {(outliers.data?.outliers ?? []).length}</Badge>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="p-3">Org</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Period end</th>
              <th className="p-3">Stripe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-b border-border/50">
                <td className="p-3">{String(r.orgName ?? r.orgId)}</td>
                <td className="p-3"><Badge>{String(r.planTier)}</Badge></td>
                <td className="p-3">{String(r.status)}</td>
                <td className="p-3 text-muted">{r.currentPeriodEnd ? new Date(String(r.currentPeriodEnd)).toLocaleDateString() : '—'}</td>
                <td className="p-3">
                  {r.stripeDashboardUrl ? (
                    <a className="text-primary hover:underline" href={String(r.stripeDashboardUrl)} target="_blank" rel="noreferrer">
                      Dashboard
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Usage outliers (free tier)</h3>
        <ul className="text-sm space-y-2">
          {(outliers.data?.outliers ?? []).map((o) => (
            <li key={String(o.orgId)}>
              {String(o.name)} — <code className="text-xs">{JSON.stringify(o.usage)}</code>
            </li>
          ))}
          {(outliers.data?.outliers ?? []).length === 0 && <p className="text-muted">None</p>}
        </ul>
        <Button size="sm" variant="secondary" onClick={() => outliers.refetch()}>Refresh</Button>
      </Card>
    </div>
  );
}
