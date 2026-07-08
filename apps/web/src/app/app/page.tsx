'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';
import { Inbox, Wallet } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { Badge, EmptyState, Skeleton, StatCard } from '@/components/ui';
import { PageError } from '@/components/page-states';
import {
  useAccounts,
  useCashFlow,
  useHealthScore,
  useInbox,
  useInsights,
  useLiabilities,
  useNetWorth,
  useRecurring,
} from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { type Liability, type RecurringStream } from '@/lib/api';

const HealthScoreRadar = dynamic(
  () => import('@/components/health-score-radar').then((m) => m.HealthScoreRadar),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full" /> },
);

const HealthSubScores = dynamic(
  () => import('@/components/health-score-radar').then((m) => m.HealthSubScores),
  { ssr: false, loading: () => <Skeleton className="h-24 w-full" /> },
);

const NetWorthChart = dynamic(
  () => import('@/components/net-worth-chart').then((m) => m.NetWorthChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[220px] w-full" />,
  },
);

const PlaidLinkButton = dynamic(
  () => import('@/components/plaid-link-button').then((m) => m.PlaidLinkButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-40" />,
  },
);

const ActionQueue = dynamic(
  () => import('@/components/action-queue').then((m) => m.ActionQueue),
  { ssr: false, loading: () => <Skeleton className="h-32 w-full" /> },
);

interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  source: 'liability' | 'recurring';
}

function estimateNextDue(lastDate: string, frequency?: string): string {
  const base = new Date(lastDate);
  if (Number.isNaN(base.getTime())) return lastDate;
  const next = new Date(base);
  switch (frequency?.toUpperCase()) {
    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;
    case 'BIWEEKLY':
      next.setDate(next.getDate() + 14);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'ANNUALLY':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString().slice(0, 10);
}

function buildUpcomingBills(
  liabilities: Liability[],
  recurring: RecurringStream[],
): UpcomingBill[] {
  const bills: UpcomingBill[] = [];

  for (const l of liabilities) {
    if (!l.nextPaymentDue) continue;
    bills.push({
      id: `liability-${l.id}`,
      name: l.liabilityType?.replace(/_/g, ' ') ?? 'Payment',
      amount: parseFloat(l.minimumPayment ?? '0'),
      dueDate: l.nextPaymentDue,
      source: 'liability',
    });
  }

  for (const r of recurring) {
    if (!r.isActive || !r.lastDate) continue;
    const amt = parseFloat(r.averageAmount ?? '0');
    if (amt <= 0) continue;
    bills.push({
      id: `recurring-${r.id}`,
      name: r.description ?? 'Recurring bill',
      amount: amt,
      dueDate: estimateNextDue(r.lastDate, r.frequency),
      source: 'recurring',
    });
  }

  return bills
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);
}

export default function DashboardPage() {
  const formatCurrency = useFormatCurrency();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: netWorthData, isLoading: nwLoading, error: nwError } = useNetWorth();
  const { data: cashFlow, isLoading: cfLoading } = useCashFlow();
  const { data: insights, isLoading: insLoading } = useInsights();
  const { data: health } = useHealthScore();
  const { data: inbox } = useInbox();
  const { data: recurring, isLoading: recurringLoading } = useRecurring();
  const { data: liabilities, isLoading: liabilitiesLoading } = useLiabilities();

  const netWorth = netWorthData?.current ?? null;
  const history = useMemo(
    () =>
      (netWorthData?.history ?? []).map((h) => ({
        date: h.snapshotDate,
        value: parseFloat(h.netWorth),
      })),
    [netWorthData?.history],
  );
  const topInsights = (insights ?? []).slice(0, 3);
  const inboxCount = (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);
  const upcomingBills = useMemo(
    () => buildUpcomingBills(liabilities ?? [], recurring ?? []),
    [liabilities, recurring],
  );
  const hasAccounts = (accounts?.length ?? 0) > 0;
  const loading = accountsLoading || nwLoading;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your complete financial overview"
        actions={
          inboxCount > 0 ? (
            <Link
              href="/app/inbox"
              className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-2 text-sm hover:bg-white/5"
            >
              <Inbox className="h-4 w-4" />
              Inbox
              <Badge variant="warning">{inboxCount}</Badge>
            </Link>
          ) : undefined
        }
      />

      {nwError && <PageError message={nwError.message} />}

      {!accountsLoading && !hasAccounts && (
        <EmptyState
          icon={Wallet}
          title="No accounts linked yet"
          description="Connect your bank accounts to see net worth, cash flow, and upcoming bills in one place."
          action={<PlaidLinkButton />}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
        <StatCard
          title="Net Worth"
          value={loading ? '—' : netWorth ? formatCurrency(netWorth.netWorth) : '—'}
        />
        <StatCard
          title="Total Assets"
          value={loading ? '—' : netWorth ? formatCurrency(netWorth.totalAssets) : '—'}
        />
        <StatCard
          title="Savings Rate"
          value={
            cfLoading ? '—' : cashFlow ? `${(cashFlow.savingsRate * 100).toFixed(1)}%` : '—'
          }
        />
        <StatCard
          title="Health Score"
          value={loading ? '—' : health ? `${health.overall}/100` : '—'}
        />
      </div>

      {cashFlow && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
          <StatCard
            title="Cash In"
            value={formatCurrency(cashFlow.income)}
            change={{ value: 'Income this period', trend: 'up' }}
          />
          <StatCard
            title="Cash Out"
            value={formatCurrency(cashFlow.expenses)}
            change={{ value: 'Expenses this period', trend: 'down' }}
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(cashFlow.savings)}
            change={{
              value: `${(cashFlow.savingsRate * 100).toFixed(1)}% savings rate`,
              trend: cashFlow.savings >= 0 ? 'up' : 'down',
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
        <Card title="Net Worth Over Time">
          {nwLoading ? <Skeleton className="h-[220px] w-full" /> : <NetWorthChart data={history} />}
        </Card>

        <Card title="Financial Health" className="mb-0">
          {loading || !health ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tabular-nums">{health.overall}</span>
                  <span className="text-muted text-sm">/ 100 overall</span>
                </div>
                <Link href="/app/health" className="text-xs text-primary hover:underline shrink-0">
                  Details →
                </Link>
              </div>
              <HealthScoreRadar subScores={health.subScores} />
              <HealthSubScores subScores={health.subScores} />
            </div>
          )}
        </Card>
      </div>

      <Card title="Upcoming Bills" className="mb-6 md:mb-8">
          {recurringLoading || liabilitiesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : upcomingBills.length === 0 ? (
            <p className="text-muted text-sm">No upcoming bills detected. Link accounts to sync recurring payments.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between border-b border-card-border/50 pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm capitalize">{bill.name}</p>
                    <p className="text-xs text-muted">
                      Due {bill.dueDate}
                      <span className="ml-2">
                        <Badge variant="default">{bill.source}</Badge>
                      </span>
                    </p>
                  </div>
                  <p className="tabular-nums font-medium text-sm">{formatCurrency(bill.amount)}</p>
                </div>
              ))}
              <Link href="/app/subscriptions" className="text-xs text-primary hover:underline">
                View all subscriptions →
              </Link>
            </div>
          )}
        </Card>

      <Card title="Your Action Queue" className="mb-6 md:mb-8">
        <ActionQueue />
      </Card>

      {hasAccounts && (
        <Card title="Connect More Accounts" className="mb-6 md:mb-8">
          <PlaidLinkButton />
          <p className="text-xs text-muted mt-4">
            Plaid Link ({process.env.NEXT_PUBLIC_PLAID_ENV ?? 'production'} mode)
          </p>
        </Card>
      )}

      <Card title="Recent Insights">
        {insLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : topInsights.length === 0 ? (
          <p className="text-muted text-sm">No insights yet. Link an account to get started.</p>
        ) : (
          <div className="space-y-4">
            {topInsights.map((i) => (
              <div key={i.id} className="border-l-2 border-primary pl-4">
                <p className="font-medium text-sm sm:text-base">{i.title}</p>
                <p className="text-sm text-muted mt-1">{i.body}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
