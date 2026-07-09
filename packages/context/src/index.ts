import type { Database } from '@pf/database';
import {
  budgets,
  budgetActuals,
  financialGoals,
  recommendationItems,
  dailyOrgSnapshots,
  insights,
  transactions,
  plaidItems,
} from '@pf/database';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { getGraphContextForRoute } from '@pf/graph';
import { parseDecimal } from '@pf/shared';

export interface ContextItem {
  id: string;
  title: string;
  description?: string;
  deepLink: string;
  actionLabel?: string;
  priority: number;
}

export interface Explainer {
  key: string;
  title: string;
  body: string;
}

export interface RelatedPage {
  route: string;
  label: string;
  reason: string;
}

export interface ContextAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  deepLink?: string;
}

export interface PageContext {
  route: string;
  headline: string;
  priorityItems: ContextItem[];
  explainers: Explainer[];
  relatedPages: RelatedPage[];
  alerts: ContextAlert[];
  emptyStateGuidance?: string;
}

const RELATED_PAGES: Record<string, RelatedPage[]> = {
  '/app': [
    { route: '/app/inbox', label: 'Inbox', reason: 'Items needing your attention' },
    { route: '/app/insights', label: 'Insights', reason: 'AI recommendations' },
    { route: '/app/health', label: 'Health Score', reason: 'Overall financial wellness' },
  ],
  '/app/budgets': [
    { route: '/app/transactions', label: 'Transactions', reason: 'See spending against budgets' },
    { route: '/app/goals', label: 'Goals', reason: 'Link budgets to goals' },
  ],
  '/app/transactions': [
    { route: '/app/budgets', label: 'Budgets', reason: 'Track category limits' },
    { route: '/app/inbox', label: 'Inbox', reason: 'Uncategorized items' },
  ],
  '/app/debt': [
    { route: '/app/credit', label: 'Credit', reason: 'Utilization and APR' },
    { route: '/app/goals', label: 'Goals', reason: 'Debt freedom targets' },
  ],
  '/app/net-worth': [
    { route: '/app/investments', label: 'Investments', reason: 'Portfolio allocation' },
    { route: '/app/forecasts', label: 'Forecasts', reason: 'Projected growth' },
  ],
  '/app/retirement': [
    { route: '/app/fire', label: 'FIRE', reason: 'Early retirement planning' },
    { route: '/app/scenarios', label: 'Scenarios', reason: 'What-if analysis' },
  ],
  '/app/insights': [
    { route: '/app/agents', label: 'Agents', reason: 'Deep-dive with AI advisors' },
    { route: '/app/rules', label: 'Rules', reason: 'Automate from insights' },
  ],
  '/app/inbox': [
    { route: '/app/transactions', label: 'Transactions', reason: 'Full transaction ledger' },
    { route: '/app/budgets', label: 'Budgets', reason: 'Impact of categorization' },
  ],
};

export async function buildPageContext(db: Database, orgId: string, route: string): Promise<PageContext> {
  const normalized = route.split('?')[0] ?? route;
  const priorityItems: ContextItem[] = [];
  const alerts: ContextAlert[] = [];
  let headline = 'Your financial command center';
  let emptyStateGuidance: string | undefined;

  const [snapshot] = await db
    .select()
    .from(dailyOrgSnapshots)
    .where(eq(dailyOrgSnapshots.orgId, orgId))
    .orderBy(desc(dailyOrgSnapshots.snapshotDate))
    .limit(1);

  const netWorth = snapshot ? parseDecimal(snapshot.netWorth) : 0;

  const recs = await db
    .select()
    .from(recommendationItems)
    .where(and(eq(recommendationItems.orgId, orgId), eq(recommendationItems.status, 'pending')))
    .limit(5);

  for (const rec of recs) {
    const meta = rec.metadataJson as Record<string, unknown> | null;
    priorityItems.push({
      id: rec.id,
      title: rec.title,
      description: rec.body ?? undefined,
      deepLink: (meta?.targetRoute as string) ?? '/app/insights',
      actionLabel: 'Review',
      priority: rec.priorityScore ? parseFloat(rec.priorityScore) : 0.5,
    });
  }

  if (normalized === '/app' || normalized === '/app/budgets') {
    const orgBudgets = await db.select().from(budgets).where(eq(budgets.orgId, orgId));
    for (const budget of orgBudgets.slice(0, 5)) {
      const [actual] = await db.select().from(budgetActuals).where(eq(budgetActuals.budgetId, budget.id)).limit(1);
      if (actual) {
        const spent = parseDecimal(actual.spent);
        const amount = parseDecimal(budget.amount);
        const pct = amount > 0 ? (spent / amount) * 100 : 0;
        if (pct >= 75) {
          alerts.push({
            id: budget.id,
            severity: pct >= 100 ? 'critical' : 'warning',
            message: `Budget ${pct.toFixed(0)}% spent this period`,
            deepLink: '/app/budgets',
          });
        }
      }
    }
    if (normalized === '/app/budgets') {
      headline =
        alerts.length > 0
          ? `${alerts.length} budget${alerts.length > 1 ? 's' : ''} need attention`
          : 'Your budgets are on track';
    }
  }

  if (normalized === '/app') {
    headline = netWorth > 0 ? `Net worth ${formatMoney(netWorth)} — here's what needs attention` : 'Link accounts to unlock your dashboard';
    if (netWorth === 0) {
      emptyStateGuidance = 'Connect a bank account via Plaid to see net worth, cash flow, and personalized actions.';
    }
  }

  if (normalized === '/app/goals') {
    const goals = await db.select().from(financialGoals).where(eq(financialGoals.orgId, orgId));
    const nearest = goals.find((g) => {
      const target = parseDecimal(g.targetAmount);
      const current = parseDecimal(g.currentAmount);
      return target > 0 && current / target >= 0.5 && current / target < 1;
    });
    headline = nearest
      ? `You're ${formatMoney(parseDecimal(nearest.targetAmount) - parseDecimal(nearest.currentAmount))} from "${nearest.name}"`
      : goals.length
        ? `${goals.length} active goal${goals.length > 1 ? 's' : ''}`
        : 'Set your first financial goal';
  }

  if (normalized === '/app/inbox') {
    const uncategorized = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.orgId, orgId), isNull(transactions.categoryId), eq(transactions.isDeleted, false)))
      .limit(50);
    headline =
      uncategorized.length > 0
        ? `${uncategorized.length} transaction${uncategorized.length > 1 ? 's' : ''} need categorization`
        : 'Inbox clear — great job!';
    if (uncategorized.length > 0) {
      priorityItems.unshift({
        id: 'inbox-categorize',
        title: 'Categorize transactions',
        description: 'Teaching the system improves insights everywhere',
        deepLink: '/app/inbox',
        actionLabel: 'Open inbox',
        priority: 1,
      });
    }
  }

  if (normalized === '/app/debt') {
    headline = 'Optimize your debt payoff strategy';
    priorityItems.push({
      id: 'debt-simulator',
      title: 'Compare avalanche vs snowball',
      deepLink: '/app/debt',
      actionLabel: 'Run simulator',
      priority: 0.9,
    });
  }

  if (normalized === '/app/net-worth') {
    headline = netWorth > 0 ? `Net worth: ${formatMoney(netWorth)}` : 'Track your net worth over time';
  }

  if (normalized === '/app/retirement') {
    headline = 'Plan your retirement with Monte Carlo confidence bands';
  }

  if (normalized === '/app/insights') {
    const recent = await db.select().from(insights).where(eq(insights.orgId, orgId)).limit(1);
    headline = recent.length ? 'Latest insights based on your data' : 'Generate your first AI insight';
  }

  const items = await db.select().from(plaidItems).where(eq(plaidItems.orgId, orgId)).limit(1);
  if (items.length === 0 && normalized !== '/app/onboarding') {
    emptyStateGuidance = emptyStateGuidance ?? 'Link an account in Accounts or complete Setup to unlock full context.';
  }

  const graphCtx = await getGraphContextForRoute(db, orgId, normalized);
  for (const link of graphCtx.suggestedLinks.slice(0, 2)) {
    if (link.node.route) {
      priorityItems.push({
        id: `graph-${link.node.id}`,
        title: link.node.label,
        description: `Connected via ${link.edge.linkType}`,
        deepLink: link.node.route,
        priority: link.edge.weight * 0.5,
      });
    }
  }

  priorityItems.sort((a, b) => b.priority - a.priority);

  const explainers: Explainer[] = [
    {
      key: 'net_worth',
      title: 'Net Worth',
      body: netWorth > 0 ? `Your net worth is ${formatMoney(netWorth)} based on latest snapshot.` : 'Net worth = assets minus liabilities.',
    },
    {
      key: 'savings_rate',
      title: 'Savings Rate',
      body: snapshot
        ? `Income MTD ${formatMoney(parseDecimal(snapshot.incomeMtd))}, expenses ${formatMoney(parseDecimal(snapshot.expensesMtd))}.`
        : 'Savings rate measures how much you save relative to income.',
    },
  ];

  return {
    route: normalized,
    headline,
    priorityItems: priorityItems.slice(0, 5),
    explainers,
    relatedPages: RELATED_PAGES[normalized] ?? [
      { route: '/app', label: 'Dashboard', reason: 'Overview' },
      { route: '/app/insights', label: 'Insights', reason: 'Recommendations' },
    ],
    alerts: alerts.slice(0, 3),
    emptyStateGuidance,
  };
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export * from './journeys';
