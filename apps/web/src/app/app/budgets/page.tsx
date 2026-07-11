'use client';

import { useMemo, useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input, ProvenanceChip, Select } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { useBudgets, useBudgetActuals, useCategories } from '@/hooks/use-finance';
import { api, formatCurrency } from '@/lib/api';
import { completeJourneyStepSafe } from '@/lib/journey';

function defaultPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { periodStart: iso(start), periodEnd: iso(end) };
}

export default function BudgetsPage() {
  const { data: budgets, isLoading, refetch } = useBudgets();
  const { data: actuals } = useBudgetActuals();
  const { data: categories } = useCategories();
  const isEmpty = !isLoading && (budgets?.length ?? 0) === 0;
  const [wizardStep, setWizardStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const period = defaultPeriod();
  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    periodStart: period.periodStart,
    periodEnd: period.periodEnd,
  });
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
      await completeJourneyStepSafe('plan', 'first-budget');
      setShowForm(false);
      setWizardStep(0);
      setForm({
        categoryId: '',
        amount: '',
        periodStart: defaultPeriod().periodStart,
        periodEnd: defaultPeriod().periodEnd,
      });
      refetch();
    } finally {
      setCreating(false);
    }
  };

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  const formReady = Boolean(form.categoryId && form.amount && form.periodStart && form.periodEnd);

  const openCreate = () => {
    if (isEmpty) setWizardStep(1);
    else setShowForm(true);
  };

  return (
    <div>
      <AppPageHeader
        title="Budgets"
        description="Track spending against your targets"
        actions={
          !isEmpty ? (
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'New Budget'}
            </Button>
          ) : undefined
        }
      />

      {isLoading && <PageLoading variant="list" count={3} className="mb-6" />}

      {!isLoading && (budgets?.length ?? 0) > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCardWithExplain
            title="Total Budgeted"
            value={formatCurrency(totals.budgeted)}
            explainMetric="budget_pace"
            provenance={
              <ProvenanceChip source="Budgets" detail="User targets" methodologyHref="/app/library" />
            }
          />
          <StatCardWithExplain
            title="Total Spent"
            value={formatCurrency(totals.spent)}
            change={{
              value: totals.budgeted > 0 ? `${Math.round((totals.spent / totals.budgeted) * 100)}% of budget` : '—',
              trend: totals.spent > totals.budgeted ? 'down' : 'neutral',
            }}
            provenance={
              <ProvenanceChip
                source="Transactions"
                detail="Period actuals"
                href="/app/transactions"
                methodologyHref="/app/library"
              />
            }
          />
        </div>
      )}

      {isEmpty && wizardStep === 0 && (
        <EmptyState
          icon={PiggyBank}
          title="Create your first budget"
          description="Pick a spending category, set a monthly limit, and watch actuals fill in as transactions sync."
          action={
            <Button size="sm" onClick={openCreate}>
              Start budget wizard
            </Button>
          }
        />
      )}

      {isEmpty && wizardStep >= 1 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <div className="mb-4 flex gap-2">
            {['Category', 'Amount', 'Confirm'].map((label, i) => (
              <div
                key={label}
                className={`h-1.5 flex-1 rounded-full ${i < wizardStep ? 'bg-primary' : 'bg-card-border'}`}
              />
            ))}
          </div>
          <h2 className="text-lg font-semibold mb-1">
            {wizardStep === 1 && 'What are you budgeting?'}
            {wizardStep === 2 && 'How much per period?'}
            {wizardStep === 3 && 'Confirm your first budget'}
          </h2>
          <p className="text-sm text-muted mb-4">
            {wizardStep === 1 && 'Choose a category to track — groceries, dining, or any spending group.'}
            {wizardStep === 2 && 'Set a limit for this month. You can change it later.'}
            {wizardStep === 3 && 'Review and create. Progress bars will show spent vs remaining.'}
          </p>

          {wizardStep === 1 && (
            <Select
              label="Category"
              placeholder="Category…"
              options={categoryOptions}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            />
          )}
          {wizardStep === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                placeholder="500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <Input
                label="Period start"
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
              />
              <Input
                label="Period end"
                type="date"
                value={form.periodEnd}
                onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
              />
            </div>
          )}
          {wizardStep === 3 && (
            <div className="rounded-lg border border-card-border bg-background/50 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Category</span>
                <span>{categoryOptions.find((c) => c.value === form.categoryId)?.label ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Limit</span>
                <span>{form.amount ? formatCurrency(parseFloat(form.amount)) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Period</span>
                <span>
                  {form.periodStart} → {form.periodEnd}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {wizardStep > 1 && (
              <Button variant="secondary" size="sm" onClick={() => setWizardStep(wizardStep - 1)}>
                Back
              </Button>
            )}
            {wizardStep < 3 ? (
              <Button
                size="sm"
                onClick={() => setWizardStep(wizardStep + 1)}
                disabled={
                  (wizardStep === 1 && !form.categoryId) ||
                  (wizardStep === 2 && (!form.amount || !form.periodStart || !form.periodEnd))
                }
              >
                Continue
              </Button>
            ) : (
              <Button size="sm" onClick={createBudget} disabled={creating || !formReady}>
                {creating ? 'Creating…' : 'Create budget'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setWizardStep(0)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {showForm && !isEmpty && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              placeholder="Category…"
              options={categoryOptions}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            />
            <Input
              label="Amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Input
              label="Period start"
              type="date"
              value={form.periodStart}
              onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
            />
            <Input
              label="Period end"
              type="date"
              value={form.periodEnd}
              onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
            />
          </div>
          <Button className="mt-4" onClick={createBudget} disabled={creating || !formReady}>
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {(budgets ?? []).map((budget) => {
          const actual = actuals?.find((a) => a.budgets.id === budget.id);
          const spent = parseFloat(actual?.budget_actuals.spent ?? '0');
          const remaining = parseFloat(actual?.budget_actuals.remaining ?? String(parseFloat(budget.amount) - spent));
          const limit = parseFloat(budget.amount);
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const over = spent > limit;
          const cat = categories?.find((c) => c.id === budget.categoryId);
          return (
            <Card key={budget.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <span className="font-medium">{cat?.name ?? 'Budget'}</span>
                  <p className="text-xs text-muted mt-0.5">
                    {budget.periodStart} → {budget.periodEnd}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="tabular-nums font-medium">
                    {formatCurrency(spent)}{' '}
                    <span className="text-muted font-normal">/ {formatCurrency(limit)}</span>
                  </p>
                  <p className={`text-xs ${over ? 'text-red-400' : 'text-muted'}`}>
                    {over
                      ? `${formatCurrency(spent - limit)} over`
                      : `${formatCurrency(Math.max(remaining, 0))} left`}
                  </p>
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-card-border">
                <div
                  className={`h-full rounded-full transition-[width] ${
                    over || pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${Math.round(pct)}% of budget spent`}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted tabular-nums">{Math.round(pct)}% used</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
