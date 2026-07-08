'use client';

import { useState } from 'react';
import { Inbox } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { EmptyState, Select } from '@/components/ui';
import { useInbox, useCategories } from '@/hooks/use-finance';
import { api, formatCurrency, type Transaction } from '@/lib/api';

export default function InboxPage() {
  const { data, isLoading, refetch } = useInbox();
  const { data: categories } = useCategories();
  const [busy, setBusy] = useState<string | null>(null);

  const categorize = async (txn: Transaction, categoryId: string) => {
    setBusy(txn.id);
    try {
      await api.updateTransaction(txn.id, { categoryId });
      await refetch();
    } finally {
      setBusy(null);
    }
  };

  const total = (data?.uncategorized.length ?? 0) + (data?.anomalies.length ?? 0);
  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <PageHeader
        title="Transaction Inbox"
        description={total > 0 ? `${total} items need your attention` : 'All caught up!'}
      />

      {isLoading && <PageLoading variant="list" count={4} />}

      {total === 0 && !isLoading && (
        <EmptyState
          icon={Inbox}
          title="Inbox zero!"
          description="All transactions are categorized. New uncategorized items will appear here."
        />
      )}

      {data?.uncategorized && data.uncategorized.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Uncategorized ({data.uncategorized.length})</h2>
          <div className="space-y-2">
            {data.uncategorized.map((txn) => (
              <TxnRow key={txn.id} txn={txn} categoryOptions={categoryOptions} busy={busy === txn.id} onCategorize={categorize} />
            ))}
          </div>
        </section>
      )}

      {data?.anomalies && data.anomalies.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Large Transactions ({data.anomalies.length})</h2>
          <div className="space-y-2">
            {data.anomalies.map((txn) => (
              <TxnRow key={txn.id} txn={txn} categoryOptions={categoryOptions} busy={busy === txn.id} onCategorize={categorize} anomaly />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TxnRow({
  txn,
  categoryOptions,
  busy,
  onCategorize,
  anomaly,
}: {
  txn: Transaction;
  categoryOptions: Array<{ value: string; label: string }>;
  busy: boolean;
  onCategorize: (txn: Transaction, categoryId: string) => void;
  anomaly?: boolean;
}) {
  const amt = parseFloat(txn.amount);
  return (
    <Card className={anomaly ? 'border-yellow-600/30' : ''}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-medium">{txn.merchantName ?? txn.name}</p>
          <p className="text-sm text-muted">{txn.date} {txn.pending && <span className="text-yellow-500">pending</span>}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono tabular-nums ${amt > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {formatCurrency(Math.abs(amt))}
          </span>
          <Select
            className="min-w-[160px]"
            placeholder="Categorize…"
            options={categoryOptions}
            disabled={busy}
            value=""
            onChange={(e) => e.target.value && onCategorize(txn, e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
