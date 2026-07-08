'use client';

import { PageHeader, Card } from '@/components/app-shell';
import { useLiabilities } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function CreditPage() {
  const { data: liabilities, isLoading } = useLiabilities();

  return (
    <div>
      <PageHeader title="Credit & Debt" description="Credit cards, loans, and payment schedules" />

      {isLoading && <p className="text-muted">Loading...</p>}

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
        <Card><p className="text-muted text-sm">No liabilities synced. Link credit or loan accounts via Plaid.</p></Card>
      )}
    </div>
  );
}
