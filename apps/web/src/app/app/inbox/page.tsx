'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { EmptyState, Select } from '@/components/ui';
import { CategorizationCoach } from '@/components/categorization-coach';
import { useInbox, useCategories } from '@/hooks/use-finance';
import { api, formatCurrency, type Transaction } from '@/lib/api';
import { completeJourneyStepSafe } from '@/lib/journey';
import { trackUxMetric } from '@/lib/analytics';

export default function InboxPage() {
  const { data, isLoading, refetch } = useInbox();
  const { data: categories } = useCategories();
  const [busy, setBusy] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const items = useMemo(
    () => [...(data?.uncategorized ?? []), ...(data?.anomalies ?? [])],
    [data],
  );
  const total = items.length;
  const startTotal = total + doneCount;
  const progressPct = startTotal > 0 ? Math.round((doneCount / startTotal) * 100) : 100;

  const categorize = useCallback(
    async (txn: Transaction, categoryId: string) => {
      setBusy(txn.id);
      try {
        await api.updateTransaction(txn.id, { categoryId });
        setDoneCount((n) => n + 1);
        await trackUxMetric('categorize', { entityType: 'transaction', entityId: txn.id });
        await completeJourneyStepSafe('cash-flow', 'categorize-10');
        await refetch();
      } finally {
        setBusy(null);
      }
    },
    [refetch],
  );

  useEffect(() => {
    if (total === 0) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [total]);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(total - 1, 0)));
  }, [total]);

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <AppPageHeader
        title="Transaction Inbox"
        description={
          total > 0
            ? `${total} items need your attention · j/k to move`
            : 'All caught up!'
        }
        actions={
          startTotal > 0 ? (
            <div
              className="flex items-center gap-2 text-xs text-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              aria-label="Inbox clear progress"
            >
              <div className="h-2 w-24 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <span>{progressPct}%</span>
            </div>
          ) : undefined
        }
      />

      {isLoading && <PageLoading variant="list" count={4} />}

      {!isLoading && total > 0 && <CategorizationCoach className="mb-6" />}

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
            {data.uncategorized.map((txn) => {
              const idx = items.findIndex((t) => t.id === txn.id);
              return (
                <TxnRow
                  key={txn.id}
                  txn={txn}
                  categoryOptions={categoryOptions}
                  busy={busy === txn.id}
                  onCategorize={categorize}
                  active={idx === activeIndex}
                />
              );
            })}
          </div>
        </section>
      )}

      {data?.anomalies && data.anomalies.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Large Transactions ({data.anomalies.length})</h2>
          <div className="space-y-2">
            {data.anomalies.map((txn) => {
              const idx = items.findIndex((t) => t.id === txn.id);
              return (
                <TxnRow
                  key={txn.id}
                  txn={txn}
                  categoryOptions={categoryOptions}
                  busy={busy === txn.id}
                  onCategorize={categorize}
                  anomaly
                  active={idx === activeIndex}
                />
              );
            })}
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
  active,
}: {
  txn: Transaction;
  categoryOptions: Array<{ value: string; label: string }>;
  busy: boolean;
  onCategorize: (txn: Transaction, categoryId: string) => void;
  anomaly?: boolean;
  active?: boolean;
}) {
  const amt = parseFloat(txn.amount);
  return (
    <Card
      className={`${anomaly ? 'border-yellow-600/30' : ''} ${active ? 'ring-2 ring-primary/50' : ''}`}
      aria-current={active ? 'true' : undefined}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-medium">{txn.merchantName ?? txn.name}</p>
          <p className="text-sm text-muted">
            {txn.date}{' '}
            {txn.pending && <span className="text-yellow-500">pending</span>}
          </p>
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
