'use client';

import { useMemo, useState } from 'react';
import { Tag } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useCategories, useInbox } from '@/hooks/use-finance';
import { api, formatCurrency } from '@/lib/api';

interface MerchantGroup {
  key: string;
  label: string;
  count: number;
  sampleId: string;
  amount: number;
}

/** Lists top uncategorized merchants with one-tap Confirm (suggests first category). */
export function CategorizationCoach({ className }: { className?: string }) {
  const { data: inbox, refetch } = useInbox();
  const { data: categories } = useCategories();
  const [busy, setBusy] = useState<string | null>(null);

  const merchants = useMemo((): MerchantGroup[] => {
    const map = new Map<string, MerchantGroup>();
    for (const t of inbox?.uncategorized ?? []) {
      const label = t.merchantName ?? t.name;
      const key = label.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        existing.amount += Math.abs(parseFloat(t.amount) || 0);
      } else {
        map.set(key, {
          key,
          label,
          count: 1,
          sampleId: t.id,
          amount: Math.abs(parseFloat(t.amount) || 0),
        });
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [inbox]);

  const defaultCategoryId = categories?.[0]?.id;

  const confirm = async (group: MerchantGroup) => {
    setBusy(group.key);
    try {
      if (defaultCategoryId) {
        const txns = (inbox?.uncategorized ?? []).filter(
          (t) => (t.merchantName ?? t.name).toLowerCase() === group.key,
        );
        await Promise.all(
          txns.map((t) => api.updateTransaction(t.id, { categoryId: defaultCategoryId })),
        );
      } else {
        await api.completeJourneyStep('cash-flow', 'categorize');
      }
      await refetch();
    } finally {
      setBusy(null);
    }
  };

  if (merchants.length === 0) return null;

  return (
    <Card title="Categorization coach" className={className}>
      <p className="mb-3 text-sm text-muted">
        Top uncategorized merchants — confirm to apply a default category.
      </p>
      <ul className="space-y-2">
        {merchants.map((m) => (
          <li
            key={m.key}
            className="flex items-center justify-between gap-3 rounded-lg border border-card-border/60 px-3 py-2"
          >
            <div className="min-w-0 flex items-start gap-2">
              <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.label}</p>
                <p className="text-xs text-muted">
                  {m.count} txn{m.count === 1 ? '' : 's'} · {formatCurrency(m.amount)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy === m.key || (!defaultCategoryId && !m.sampleId)}
              onClick={() => void confirm(m)}
            >
              {busy === m.key ? '…' : 'Confirm'}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
