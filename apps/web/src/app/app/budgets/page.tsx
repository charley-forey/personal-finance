'use client';

import { useMemo, useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input, Select } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { useBudgets, useBudgetActuals, useCategories } from '@/hooks/use-finance';
import { api, formatCurrency } from '@/lib/api';

export default function BudgetsPage() {
  const { data: budgets, isLoading, refetch } = useBudgets();
  const { data: actuals } = useBudgetActuals();
  const { data: categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoryId: '', amount: '', periodStart: '', periodEnd: '' });
  const [creating, setCreating] = useState(false);

  const totals = useMemo(() => {
    let budgeted = 0;
    let spent = 0;
    for (const budget of budgets ?? []) {
      budgeted += parseFloat(budget.amount);
      const actual = actuals?.find((a) => a.budgets.id === budget.id);
      spent += parseFloat(actual?.budget_actuals.spent ?? '0');
    }
    return { budgeted, spent };
  }, [budgets, actuals]);

  const createBudget = async () => {
    setCreating(true);
    try {
      await api.createBudget({
        categoryId: form.categoryId,
        amount: parseFloat(form.amount),
        periodStart: form.periodStart,
        periodEnd: form.periodEnd,
      });
      setShowForm(false);
      refetch();
    } finally {
      setCreating(false);
    }
  };

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Track spending against your targets"
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Budget'}
          </Button>
        }
      />

      {isLoading && <PageLoading variant="list" count={3} className="mb-6" />}

      {!isLoading && (budgets?.length ?? 0) > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCardWithExplain title="Total Budgeted" value={formatCurrency(totals.budgeted)} explainMetric="budget_pace" />
          <StatCardWithExplain
            title="Total Spent"
            value={formatCurrency(totals.spent)}
            change={{
              value: totals.budgeted > 0 ? `${Math.round((totals.spent / totals.budgeted) * 100)}% of budget` : '—',
              trend: totals.spent > totals.budgeted ? 'down' : 'neutral',
            }}
          />
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              placeholder="Category…"
              options={categoryOptions}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            />
            <Input label="Amount" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="Period start" type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
            <Input label="Period end" type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
          </div>
          <Button className="mt-4" onClick={createBudget} disabled={creating}>
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {(budgets ?? []).map((budget) => {
          const actual = actuals?.find((a) => a.budgets.id === budget.id);
          const spent = parseFloat(actual?.budget_actuals.spent ?? '0');
          const limit = parseFloat(budget.amount);
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const cat = categories?.find((c) => c.id === budget.categoryId);
          return (
            <Card key={budget.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{cat?.name ?? 'Budget'}</span>
                <span className="text-sm text-muted">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
              </div>
              <div className="h-2 bg-card-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
              </div>
            </Card>
          );
        })}
        {!isLoading && budgets?.length === 0 && (
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description="Create a budget to track spending against your targets."
            action={
              <Button size="sm" onClick={() => setShowForm(true)}>
                New Budget
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
