'use client';

import { useMemo } from 'react';
import { Receipt } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, StatCard } from '@/components/ui';
import { useTransactions } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function ExpensesPage() {
  const { data: txns, isLoading, error } = useTransactions(200);

  const { total, byCategory, monthly } = useMemo(() => {
    const expenses = (txns ?? []).filter((t) => parseFloat(t.amount) > 0);
    const total = expenses.reduce((s, t) => s + parseFloat(t.amount), 0);
    const byCategory: Record<string, number> = {};
    const monthly: Record<string, number> = {};
    for (const t of expenses) {
      const cat = t.plaidCategoryPrimary ?? 'Other';
      byCategory[cat] = (byCategory[cat] ?? 0) + parseFloat(t.amount);
      const month = t.date.slice(0, 7);
      monthly[month] = (monthly[month] ?? 0) + parseFloat(t.amount);
    }
    return { total, byCategory, monthly };
  }, [txns]);

  const categoryCount = Object.keys(byCategory).length;

  return (
    <div>
      <AppPageHeader title="Expenses" description="Spending breakdown and trends" />

      {error && <PageError message={error.message} />}
      {isLoading && <PageLoading variant="stats" count={2} className="mb-6" />}

      {!isLoading && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCard title="Total Expenses" value={formatCurrency(total)} />
          <StatCard title="Categories" value={String(categoryCount)} />
        </div>
      )}

      {!isLoading && total === 0 && (
        <EmptyState
          icon={Receipt}
          title="No expenses tracked"
          description="Expense transactions will appear here once accounts are linked and synced."
        />
      )}

      {total > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="By Category">
            <div className="space-y-2 mt-2">
              {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, amt]) => {
                const pct = total > 0 ? (amt / total) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted truncate">{cat.replace(/_/g, ' ')}</span>
                      <span className="tabular-nums">{formatCurrency(amt)}</span>
                    </div>
                    <div className="h-1 bg-card-border rounded-full"><div className="h-full bg-red-400/70 rounded-full" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card title="By Month">
            <div className="space-y-2 mt-2">
              {Object.entries(monthly).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6).map(([month, amt]) => (
                <div key={month} className="flex justify-between text-sm">
                  <span className="text-muted">{month}</span>
                  <span className="tabular-nums text-red-400">{formatCurrency(amt)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
