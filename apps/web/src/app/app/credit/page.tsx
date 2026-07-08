'use client';

import { CreditCard } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, StatCard } from '@/components/ui';
import { useLiabilities } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function CreditPage() {
  const { data: liabilities, isLoading, error } = useLiabilities();

  const totalMinPayment = (liabilities ?? []).reduce(
    (sum, l) => sum + parseFloat(l.minimumPayment ?? '0'),
    0,
  );
  const avgApr =
    (liabilities ?? []).filter((l) => l.apr).length > 0
      ? (liabilities ?? [])
          .filter((l) => l.apr)
          .reduce((sum, l) => sum + parseFloat(l.apr!), 0) /
        (liabilities ?? []).filter((l) => l.apr).length
      : 0;

  return (
    <div>
      <PageHeader title="Credit & Debt" description="Credit cards, loans, and payment schedules" />

      {error && <PageError message={error.message} />}
      {isLoading && <PageLoading variant="cards" count={2} className="mb-6" />}

      {!isLoading && (liabilities?.length ?? 0) > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCard title="Accounts" value={String(liabilities?.length ?? 0)} />
          <StatCard title="Total Min Payment" value={formatCurrency(totalMinPayment)} />
          {avgApr > 0 && (
            <StatCard title="Avg APR" value={`${avgApr.toFixed(2)}%`} className="col-span-2 sm:col-span-1" />
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(liabilities ?? []).map((l) => (
          <Card key={l.id}>
            <p className="text-xs text-muted uppercase">{l.liabilityType ?? 'liability'}</p>
            <div className="mt-3 space-y-2 text-sm">
              {l.apr && <div className="flex justify-between"><span className="text-muted">APR</span><span>{parseFloat(l.apr).toFixed(2)}%</span></div>}
              {l.minimumPayment && <div className="flex justify-between"><span className="text-muted">Min Payment</span><span>{formatCurrency(l.minimumPayment)}</span></div>}
              {l.nextPaymentDue && <div className="flex justify-between"><span className="text-muted">Due Date</span><span>{l.nextPaymentDue}</span></div>}
            </div>
          </Card>
        ))}
      </div>

      {liabilities?.length === 0 && !isLoading && (
        <EmptyState
          icon={CreditCard}
          title="No liabilities synced"
          description="Link credit or loan accounts via Plaid to track balances and payment schedules."
        />
      )}
    </div>
  );
}
