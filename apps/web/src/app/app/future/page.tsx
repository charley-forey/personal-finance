'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, StatCard } from '@/components/ui';
import {
  useFire,
  useLiabilities,
  useTaxEstimate,
} from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';

const LINKS = [
  { href: '/app/retirement', label: 'Retirement', description: 'Monte Carlo planning' },
  { href: '/app/fire', label: 'FIRE', description: 'Financial independence' },
  { href: '/app/debt', label: 'Debt', description: 'Payoff simulator' },
  { href: '/app/credit', label: 'Credit', description: 'Utilization and APR' },
  { href: '/app/taxes', label: 'Taxes', description: 'Tax profile and estimates' },
  { href: '/app/life-plans', label: 'Life Plans', description: 'Major life events' },
  { href: '/app/scenarios', label: 'Scenarios', description: 'What-if studio' },
];

export default function FutureHubPage() {
  const fmt = useFormatCurrency();
  const { data: fire, isLoading: fireLoading, error: fireError } = useFire();
  const { data: tax, isLoading: taxLoading, error: taxError } = useTaxEstimate();
  const { data: liabilities, isLoading: liabLoading, error: liabError } = useLiabilities();

  const debtMinPayments = useMemo(
    () =>
      (liabilities ?? []).reduce((sum, l) => sum + parseFloat(l.minimumPayment ?? '0'), 0),
    [liabilities],
  );
  const debtCount = liabilities?.length ?? 0;
  const loading = fireLoading || taxLoading || liabLoading;
  const error = fireError ?? taxError ?? liabError;

  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout
        title="Future"
        description="Where am I headed?"
        hubId="future"
        links={LINKS}
        firstJob={{
          href: '/app/retirement',
          label: 'Run a retirement projection',
          description: 'Set assumptions and see median outcomes before comparing scenarios.',
        }}
      >
        {error && <PageError message={error.message} />}

        {loading ? (
          <PageLoading variant="stats" count={3} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              title="FIRE Progress"
              value={fire ? `${Math.round(fire.progress)}%` : '—'}
              change={{
                value: fire
                  ? `${fire.yearsToFI.toFixed(1)} yrs · ${fmt(fire.fireNumber)} FI`
                  : 'Open simulator',
                trend: 'neutral',
              }}
            />
            <StatCard
              title="Debt Snapshot"
              value={debtCount === 0 ? 'None' : String(debtCount)}
              change={{
                value:
                  debtCount === 0
                    ? 'No liabilities synced'
                    : `${fmt(debtMinPayments)}/mo minimum`,
                trend: debtCount === 0 ? 'up' : 'neutral',
              }}
            />
            <StatCard
              title="Tax Estimate"
              value={tax ? fmt(tax.totalTax) : '—'}
              change={{
                value: tax
                  ? `${(tax.effectiveRate * 100).toFixed(1)}% effective`
                  : 'Set tax profile',
                trend: tax?.owedOrRefund && tax.owedOrRefund < 0 ? 'up' : 'neutral',
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link href="/app/fire">
            <Button size="sm">FIRE simulator</Button>
          </Link>
          <Link href="/app/debt">
            <Button size="sm" variant="secondary">
              Debt payoff
            </Button>
          </Link>
          <Link href="/app/taxes">
            <Button size="sm" variant="secondary">
              Tax center
            </Button>
          </Link>
          <Link href="/app/scenarios">
            <Button size="sm" variant="secondary">
              What-if scenarios
            </Button>
          </Link>
        </div>
      </HubLayout>
    </div>
  );
}
