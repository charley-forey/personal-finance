'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { useBudgets, useBudgetActuals, useCategories } from '@/hooks/use-finance';
import { api, formatCurrency } from '@/lib/api';

export default function BudgetsPage() {
  const { data: budgets, refetch } = useBudgets();
  const { data: actuals } = useBudgetActuals();
  const { data: categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoryId: '', amount: '', periodStart: '', periodEnd: '' });

  const createBudget = async () => {
    await api.createBudget({
      categoryId: form.categoryId,
      amount: parseFloat(form.amount),
      periodStart: form.periodStart,
      periodEnd: form.periodEnd,
    });
    setShowForm(false);
    refetch();
  };

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Track spending against your targets"
        actions={
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm">
            {showForm ? 'Cancel' : 'New Budget'}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Category...</option>
              {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Amount" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <input type="date" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
            <input type="date" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
          </div>
          <button onClick={createBudget} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium">Create</button>
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
        {budgets?.length === 0 && <Card><p className="text-muted text-sm">No budgets yet. Create one to track spending.</p></Card>}
      </div>
    </div>
  );
}
