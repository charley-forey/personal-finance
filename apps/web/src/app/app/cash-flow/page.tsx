'use client';

import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';
import { useNarrativeSession } from '@/hooks/use-finance';
import { Skeleton } from '@/components/ui';

const LINKS = [
  { href: '/app/accounts', label: 'Accounts', description: 'Linked banks and balances' },
  { href: '/app/transactions', label: 'Transactions', description: 'Searchable ledger' },
  { href: '/app/activity', label: 'Activity', description: 'Financial changelog' },
  { href: '/app/income', label: 'Income', description: 'Income breakdown' },
  { href: '/app/expenses', label: 'Expenses', description: 'Spending by category' },
  { href: '/app/subscriptions', label: 'Subscriptions', description: 'Recurring charges' },
  { href: '/app/calendar', label: 'Bill Calendar', description: 'Upcoming bills' },
];

export default function CashFlowHubPage() {
  const { data: narrative, isLoading } = useNarrativeSession();

  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout
        title="Cash Flow"
        description="Where is my money going?"
        hubId="cash-flow"
        links={LINKS}
      >
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : narrative ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-border/60 p-3">{narrative.content}</p>
        ) : null}
      </HubLayout>
    </div>
  );
}
