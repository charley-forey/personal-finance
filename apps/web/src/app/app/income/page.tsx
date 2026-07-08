'use client';

import { useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, StatCard } from '@/components/ui';
import { useTransactions } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function IncomePage() {
  const { data: txns, isLoading, error } = useTransactions(200);

  const { total, byCategory, monthly } = useMemo(() => {
    const income = (txns ?? []).filter((t) => parseFloat(t.amount) < 0);
    const total = income.reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
    const byCategory: Record<string, number> = {};
    const monthly: Record<string, number> = {};
    for (const t of income) {
      const cat = t.plaidCategoryPrimary ?? 'Other';
      byCategory[cat] = (byCategory[cat] ?? 0) + Math.abs(parseFloat(t.amount));
      const month = t.date.slice(0, 7);
      monthly[month] = (monthly[month] ?? 0) + Math.abs(parseFloat(t.amount));
    }
    return { total, byCategory, monthly };
  }, [txns]);

  const sourceCount = Object.keys(byCategory).length;

  return (
    <div>
      <PageHeader title="Income" description="Income sources and YTD trends" />

      {error && <PageError message={error.message} />}
      {isLoading && <PageLoading variant="stats" count={2} className="mb-6" />}

      {!isLoading && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCard title="Total Income" value={formatCurrency(total)} />
          <StatCard title="Sources" value={String(sourceCount)} />
        </div>
      )}

      {!isLoading && total === 0 && (
        <EmptyState
          icon={Wallet}
          title="No income tracked"
          description="Income transactions will appear here once accounts are linked and synced."
        />
      )}

      {total > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="By Category">
            <div className="space-y-2 mt-2">
              {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-muted truncate">{cat.replace(/_/g, ' ')}</span>
                  <span className="tabular-nums">{formatCurrency(amt)}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="By Month">
            <div className="space-y-2 mt-2">
              {Object.entries(monthly).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6).map(([month, amt]) => (
                <div key={month} className="flex justify-between text-sm">
                  <span className="text-muted">{month}</span>
                  <span className="tabular-nums text-green-400">{formatCurrency(amt)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
