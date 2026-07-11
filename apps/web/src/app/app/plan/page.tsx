'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { HubLayout } from '@/components/hub-layout';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, EmptyState, StatCard } from '@/components/ui';
import {
  useBudgetActuals,
  useBudgets,
  usePnl,
  useRecommendations,
  useRules,
} from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';

export default function PlanHubPage() {
  const fmt = useFormatCurrency();
  const now = new Date();
  const { data: budgets, isLoading: budgetsLoading, error: budgetsError } = useBudgets();
  const { data: actuals, isLoading: actualsLoading } = useBudgetActuals();
  const { data: pnl, isLoading: pnlLoading, error: pnlError } = usePnl(
    now.getFullYear(),
    now.getMonth() + 1,
  );
  const { data: rules, isLoading: rulesLoading } = useRules();
  const { data: recommendations } = useRecommendations();

  const totals = useMemo(() => {
    let budgeted = 0;
    let spent = 0;
    for (const budget of budgets ?? []) {
      budgeted += parseFloat(budget.amount);
      const actual = actuals?.find((a) => a.budgets.id === budget.id);
      spent += parseFloat(actual?.budget_actuals.spent ?? '0');
    }
    return { budgeted, spent, remaining: budgeted - spent };
  }, [budgets, actuals]);

  const netIncome = useMemo(() => {
    if (!pnl) return null;
    const netCell = pnl.cells.find(
      (c) => c.rowKey === 'Net Income' && c.columnKey === 'Actual',
    );
    return netCell ? parseFloat(netCell.value) : null;
  }, [pnl]);

  const ruleSuggestions = (recommendations ?? [])
    .filter((r) => r.actionType.toLowerCase().includes('rule') || r.status === 'pending')
    .slice(0, 3);
  const enabledRules = (rules ?? []).filter((r) => r.enabled).length;
  const loading = budgetsLoading || actualsLoading || pnlLoading || rulesLoading;
  const error = budgetsError ?? pnlError;
  const pacePct = totals.budgeted > 0 ? Math.round((totals.spent / totals.budgeted) * 100) : 0;

  return (
    <HubLayout
      title="Plan & Control"
      description="Am I on track?"
      hubId="plan"
      hubHref="/app/plan"
      firstJob={{
        href: '/app/budgets',
        label: 'Set your first budget',
        description: 'Create category limits from recent spending so Plan can track pace.',
      }}
    >
      {error && <PageError message={error.message} />}

      {loading ? (
        <PageLoading variant="stats" count={3} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            title="Budget vs Actual"
            value={fmt(totals.spent)}
            change={{
              value:
                totals.budgeted > 0
                  ? `${pacePct}% of ${fmt(totals.budgeted)}`
                  : 'No budgets set',
              trend: totals.spent > totals.budgeted ? 'down' : 'up',
            }}
          />
          <StatCard
            title="P&L Status"
            value={netIncome == null ? '—' : fmt(netIncome)}
            change={{
              value: pnl?.period.status ? `Period ${pnl.period.status}` : 'Current month',
              trend: (netIncome ?? 0) >= 0 ? 'up' : 'down',
            }}
          />
          <StatCard
            title="Active Rules"
            value={String(enabledRules)}
            change={{
              value: `${rules?.length ?? 0} total`,
              trend: 'neutral',
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/app/budgets">
          <Button size="sm">Manage budgets</Button>
        </Link>
        <Link href="/app/pnl">
          <Button size="sm" variant="secondary">
            Open P&L
          </Button>
        </Link>
        <Link href="/app/rules">
          <Button size="sm" variant="secondary">
            Automate rules
          </Button>
        </Link>
      </div>

      {!loading && (budgets?.length ?? 0) === 0 && (
        <EmptyState
          title="No budgets yet"
          description="Set category limits to track spend against plan."
          action={
            <Link href="/app/budgets">
              <Button size="sm">Create a budget</Button>
            </Link>
          }
        />
      )}

      {ruleSuggestions.length > 0 && (
        <div className="rounded-lg border border-card-border/60 p-4 space-y-3">
          <p className="text-sm font-medium">Rule suggestions</p>
          {ruleSuggestions.map((item) => (
            <div key={item.id} className="text-sm">
              <p className="font-medium">{item.title}</p>
              {item.body ? <p className="text-xs text-muted mt-0.5">{item.body}</p> : null}
            </div>
          ))}
          <Link href="/app/rules" className="text-xs text-primary hover:underline">
            Review automation →
          </Link>
        </div>
      )}
    </HubLayout>
  );
}
