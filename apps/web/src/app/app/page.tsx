'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Inbox, ListChecks, Wallet, X } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { useNarrativeSession, usePlaidItems } from '@/hooks/use-finance';
import { Button, Badge, EmptyState, Skeleton, StatCard } from '@/components/ui';
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
import { api, type Liability, type RecurringStream } from '@/lib/api';

const SETUP_DISMISS_KEY = 'pf_setup_dismissed';
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

const WeeklyDigestPreview = dynamic(
  () => import('@/components/weekly-digest-preview').then((m) => m.WeeklyDigestPreview),
  { ssr: false, loading: () => <Skeleton className="h-40 w-full" /> },
);

function SinceLastVisit() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-changes'],
    queryFn: () => api.recentChanges(),
  });
  if (isLoading) return <Skeleton className="h-24 w-full mb-4" />;
  if (!data?.length) return null;
  return (
    <Card title="Since last visit" className="mb-4">
      <ul className="space-y-2 text-sm">
        {data.slice(0, 8).map((c) => (
          <li key={c.id} className="flex justify-between gap-2 text-muted">
            <span>
              {c.entityType}
              {c.fieldName ? ` · ${c.fieldName}` : ''}
            </span>
            <span className="tabular-nums text-xs">
              {c.detectedAt ? new Date(c.detectedAt).toLocaleString() : c.changeSource}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

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
  const [timeScope, setTimeScope] = useState<'today' | 'week' | 'month'>('month');
  const [showOnboardingWelcome, setShowOnboardingWelcome] = useState(false);
  const [setupDismissed, setSetupDismissed] = useState(true);
  const formatCurrency = useFormatCurrency();
  const { data: sessionNarrative } = useNarrativeSession();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: plaidItems, isLoading: plaidLoading } = usePlaidItems();
  const { data: netWorthData, isLoading: nwLoading, error: nwError } = useNetWorth();
  const { data: cashFlow, isLoading: cfLoading } = useCashFlow();
  const { data: insights, isLoading: insLoading } = useInsights();
  const { data: health } = useHealthScore();
  const { data: inbox } = useInbox();
  const { data: recurring, isLoading: recurringLoading } = useRecurring();
  const { data: liabilities, isLoading: liabilitiesLoading } = useLiabilities();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding') === 'complete') {
      setShowOnboardingWelcome(true);
      const t = setTimeout(() => setShowOnboardingWelcome(false), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSetupDismissed(localStorage.getItem(SETUP_DISMISS_KEY) === '1');
  }, []);

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
  const uncategorized = inbox?.uncategorized.length ?? 0;
  const anomalies = inbox?.anomalies.length ?? 0;
  const inboxCount = uncategorized + anomalies;
  const upcomingBills = useMemo(
    () => buildUpcomingBills(liabilities ?? [], recurring ?? []),
    [liabilities, recurring],
  );
  const hasAccounts = (accounts?.length ?? 0) > 0;
  const hasPlaid = (plaidItems?.length ?? 0) > 0;
  const showSetupChecklist = !plaidLoading && !hasPlaid && !setupDismissed;
  const loading = accountsLoading || nwLoading;

  const dismissSetup = () => {
    localStorage.setItem(SETUP_DISMISS_KEY, '1');
    setSetupDismissed(true);
  };

  return (
    <div>
      <PageHeader
        title="Command"
        description="Your action center and financial overview"
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

      {showOnboardingWelcome && (
        <Card className="mb-4 border-emerald-500/40 bg-emerald-500/5">
          <div className="flex gap-3 items-start">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-400">Setup complete</p>
              <p className="text-sm text-muted mt-1">
                Start with your Action Queue below, or explore{' '}
                <Link href="/app/insights" className="text-primary hover:underline">
                  Insights
                </Link>
                .
              </p>
            </div>
          </div>
        </Card>
      )}

      {showSetupChecklist && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 items-start min-w-0">
              <ListChecks className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Setup checklist</p>
                <p className="text-sm text-muted mt-1">
                  Link a bank and finish setup so Command, cash flow, and insights have real data.
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    <Link href="/app/onboarding" className="text-primary hover:underline">
                      Continue setup wizard →
                    </Link>
                  </li>
                  <li>
                    <Link href="/app/accounts" className="text-primary hover:underline">
                      Link an account →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissSetup}
              className="shrink-0 rounded p-1 text-muted hover:text-foreground hover:bg-white/5"
              aria-label="Dismiss setup checklist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {sessionNarrative && (
        <p className="text-sm text-muted mb-4 rounded-lg border border-card-border/60 p-3">
          {sessionNarrative.content}
        </p>
      )}

      {/* Primary above-the-fold: Action Queue + inbox/health summary */}
      <Card title="Your Action Queue" className="mb-4">
        <ActionQueue />
      </Card>

      <SinceLastVisit />

      <WeeklyDigestPreview />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
        <StatCard
          title="Inbox"
          value={String(inboxCount)}
          change={{
            value:
              inboxCount === 0
                ? 'All clear'
                : `${uncategorized} uncategorized · ${anomalies} anomalies`,
            trend: inboxCount === 0 ? 'up' : 'down',
          }}
        />
        <StatCardWithExplain
          title="Health Score"
          value={loading ? '—' : health ? `${health.overall}/100` : '—'}
        />
        <StatCardWithExplain
          title="Net Worth"
          value={loading ? '—' : netWorth ? formatCurrency(netWorth.netWorth) : '—'}
        />
        <StatCardWithExplain
          title="Savings Rate"
          value={
            cfLoading ? '—' : cashFlow ? `${(cashFlow.savingsRate * 100).toFixed(1)}%` : '—'
          }
        />
      </div>

      <div className="flex gap-2 mb-4">
        {(['today', 'week', 'month'] as const).map((scope) => (
          <Button
            key={scope}
            size="sm"
            variant={timeScope === scope ? 'primary' : 'secondary'}
            onClick={() => setTimeScope(scope)}
          >
            {scope.charAt(0).toUpperCase() + scope.slice(1)}
          </Button>
        ))}
      </div>

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
          <p className="text-muted text-sm">
            No upcoming bills detected. Link accounts to sync recurring payments.
          </p>
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
