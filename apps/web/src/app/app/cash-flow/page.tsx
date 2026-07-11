'use client';

import Link from 'next/link';
import { Inbox } from 'lucide-react';
import { HubLayout } from '@/components/hub-layout';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, ProvenanceChip } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import {
  useBillCalendar,
  useCashFlow,
  useInbox,
  useNarrativeSession,
  useNetWorth,
} from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { formatDate } from '@/lib/format';

const LINK_DESCRIPTIONS: Record<string, string> = {
  '/app/accounts': 'Linked banks and balances',
  '/app/transactions': 'Searchable ledger',
  '/app/activity': 'Financial changelog',
  '/app/income': 'Income breakdown',
  '/app/expenses': 'Spending by category',
  '/app/subscriptions': 'Recurring charges',
  '/app/calendar': 'Upcoming bills',
};

export default function CashFlowHubPage() {
  const fmt = useFormatCurrency();
  const { data: narrative, isLoading: narrativeLoading } = useNarrativeSession();
  const { data: nw, isLoading: nwLoading, error: nwError } = useNetWorth();
  const { data: cashFlow, isLoading: cfLoading, error: cfError } = useCashFlow();
  const { data: bills, isLoading: billsLoading, error: billsError } = useBillCalendar();
  const { data: inbox } = useInbox();

  const cash = nw?.current.cash ?? 0;
  const inboxCount = (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);
  const upcoming = (bills?.events ?? []).slice(0, 4);
  const loading = nwLoading || cfLoading || billsLoading;
  const error = nwError ?? cfError ?? billsError;

  return (
    <HubLayout
      title="Cash Flow"
      description="Where is my money going?"
      hubId="cash-flow"
      hubHref="/app/cash-flow"
      linkDescriptions={LINK_DESCRIPTIONS}
      firstJob={{
        href: '/app/inbox',
        label: 'Categorize recent transactions',
        description: 'Clear uncategorized items so spend and budgets stay accurate.',
      }}
    >
      {error && <PageError message={error.message} />}

      {loading ? (
        <PageLoading variant="stats" count={3} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCardWithExplain
            title="Cash Position"
            value={fmt(cash)}
            provenance={
              <ProvenanceChip source="Accounts" detail="Cash & checking" href="/app/accounts" />
            }
          />
          <StatCardWithExplain
            title="Spend Pulse"
            value={fmt(cashFlow?.expenses ?? 0)}
            change={{
              value: cashFlow
                ? `${(cashFlow.savingsRate * 100).toFixed(1)}% savings rate`
                : 'This period',
              trend: (cashFlow?.savings ?? 0) >= 0 ? 'up' : 'down',
            }}
            explainMetric="savings_rate"
            provenance={
              <ProvenanceChip source="Cash flow" detail="This period" href="/app/expenses" />
            }
          />
          <StatCardWithExplain
            title="Bills Due (30d)"
            value={fmt(bills?.totalDue ?? 0)}
            change={{
              value: `${bills?.events.length ?? 0} upcoming`,
              trend: 'neutral',
            }}
            provenance={
              <ProvenanceChip source="Recurring + liabilities" detail="Next 30 days" href="/app/calendar" />
            }
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/app/inbox">
          <Button size="sm">
            <Inbox className="h-4 w-4 mr-1.5" />
            Categorize inbox{inboxCount > 0 ? ` (${inboxCount})` : ''}
          </Button>
        </Link>
        <Link href="/app/calendar">
          <Button size="sm" variant="secondary">
            Bill calendar
          </Button>
        </Link>
        <Link href="/app/expenses">
          <Button size="sm" variant="secondary">
            View spending
          </Button>
        </Link>
      </div>

      {!billsLoading && upcoming.length > 0 && (
        <div className="rounded-lg border border-card-border/60 p-4 space-y-3">
          <p className="text-sm font-medium">Upcoming bills</p>
          {upcoming.map((event) => (
            <div
              key={`${event.sourceId}-${event.date}-${event.type}`}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium">{event.label}</p>
                <p className="text-xs text-muted">Due {formatDate(event.date)}</p>
              </div>
              <p className="tabular-nums font-medium">{fmt(event.amount)}</p>
            </div>
          ))}
          <Link href="/app/calendar" className="text-xs text-primary hover:underline">
            View full calendar →
          </Link>
        </div>
      )}

      {narrativeLoading ? null : narrative ? (
        <p className="text-sm text-muted rounded-lg border border-card-border/60 p-3">
          {narrative.content}
        </p>
      ) : null}
    </HubLayout>
  );
}
