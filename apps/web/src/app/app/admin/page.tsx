'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, StatCard, Badge, Button } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminCommandCenterPage() {
  const overview = useQuery({ queryKey: ['admin-overview'], queryFn: () => adminApi.overview() });
  const funnel = useQuery({ queryKey: ['admin-funnel'], queryFn: () => adminApi.funnel() });
  const alerts = useQuery({ queryKey: ['admin-alerts'], queryFn: () => adminApi.alerts() });
  const health = useQuery({ queryKey: ['admin-health'], queryFn: () => adminApi.deepHealth() });

  if (overview.isLoading) return <PageLoading variant="stats" />;
  if (overview.isError) return <PageError message={(overview.error as Error).message} onRetry={() => overview.refetch()} />;

  const o = overview.data ?? {};
  const ai = (o.ai30d as Record<string, unknown>) ?? {};
  const plaid = (o.plaid as Record<string, unknown>) ?? {};

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Command Center"
        description="Live platform health, growth, revenue proxies, and AI cost."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Organizations" value={String(o.orgs ?? 0)} />
        <StatCard title="Users" value={String(o.users ?? 0)} />
        <StatCard title="Signups (7d)" value={String(o.signups7d ?? 0)} />
        <StatCard title="Paid subs" value={String(o.paidSubscriptions ?? 0)} />
        <StatCard title="Past due" value={String(o.pastDue ?? 0)} />
        <StatCard title="Bank-linked orgs" value={String(o.linkedBankOrgs ?? 0)} />
        <StatCard title="AI cost (30d est.)" value={`$${ai.estimatedCostUsd ?? 0}`} />
        <StatCard title="Plaid login_required" value={String(plaid.loginRequired ?? 0)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Alerts</h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await adminApi.refreshAlerts();
                alerts.refetch();
              }}
            >
              Refresh thresholds
            </Button>
          </div>
          {(alerts.data ?? []).length === 0 && <p className="text-sm text-muted">No alerts</p>}
          <ul className="space-y-2">
            {(alerts.data ?? []).slice(0, 8).map((a) => (
              <li key={String(a.id)} className="flex items-start justify-between gap-2 text-sm border-b border-border/60 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.severity === 'critical' ? 'danger' : 'warning'}>{String(a.severity)}</Badge>
                    <span className="font-medium">{String(a.title)}</span>
                  </div>
                  <p className="text-muted mt-1">{String(a.message)}</p>
                </div>
                {a.status === 'open' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await adminApi.acknowledgeAlert(String(a.id));
                      alerts.refetch();
                    }}
                  >
                    Ack
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 space-y-3">
          <h2 className="font-medium">Activation funnel</h2>
          {funnel.isLoading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Orgs with bank</dt>
                <dd className="text-lg font-semibold">{String(funnel.data?.orgsWithBankLink ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-muted">Activation rate</dt>
                <dd className="text-lg font-semibold">{String(funnel.data?.activationRate ?? 0)}%</dd>
              </div>
              <div>
                <dt className="text-muted">Onboarding done</dt>
                <dd className="text-lg font-semibold">{String(funnel.data?.onboardingCompletedUsers ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-muted">Total orgs</dt>
                <dd className="text-lg font-semibold">{String(funnel.data?.totalOrgs ?? 0)}</dd>
              </div>
            </dl>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/app/admin/orgs"><Button size="sm" variant="secondary">Orgs</Button></Link>
            <Link href="/app/admin/ops"><Button size="sm" variant="secondary">Ops</Button></Link>
            <Link href="/app/admin/billing"><Button size="sm" variant="secondary">FinOps</Button></Link>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await adminApi.weeklyScorecard();
                overview.refetch();
              }}
            >
              Generate weekly scorecard
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-medium mb-3">Deep health</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(health.data ?? {}).map(([k, v]) => {
            if (typeof v === 'object') return null;
            return (
              <Badge key={k} variant={v === true || v === 'development' ? 'success' : v === false ? 'danger' : 'default'}>
                {k}: {String(v)}
              </Badge>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
