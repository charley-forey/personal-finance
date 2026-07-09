import type { Database } from '@pf/database';
import { narrativeCache, dailyOrgSnapshots, insights } from '@pf/database';
import { eq, desc, and, gt, or, isNull } from 'drizzle-orm';
import { parseDecimal } from '@pf/shared';

export interface NarrativeResult {
  content: string;
  cacheKey: string;
  links: { route: string; label: string }[];
}

export interface ExplainResult {
  metric: string;
  title: string;
  definition: string;
  yourValue: string;
  benchmark?: string;
  whatChanged?: string;
  suggestedAction?: string;
}

const METRIC_EXPLAIN: Record<string, { title: string; definition: string; benchmark: string }> = {
  net_worth: {
    title: 'Net Worth',
    definition: 'Total assets minus total liabilities across all linked accounts and manual assets.',
    benchmark: 'Growing month-over-month is a positive signal.',
  },
  savings_rate: {
    title: 'Savings Rate',
    definition: 'Percentage of income saved after expenses in the current period.',
    benchmark: 'Financial planners often target 15–20% for long-term wealth building.',
  },
  health_score: {
    title: 'Financial Health Score',
    definition: 'Composite score from emergency fund, debt, savings, and investment diversification.',
    benchmark: 'Scores above 70 indicate strong overall financial wellness.',
  },
  debt_ratio: {
    title: 'Debt Ratio',
    definition: 'Total debt relative to income and assets.',
    benchmark: 'Lower debt ratios improve flexibility and reduce interest costs.',
  },
  budget_pace: {
    title: 'Budget Pace',
    definition: 'How quickly you are spending relative to the budget period timeline.',
    benchmark: 'Even pacing through the month helps avoid end-of-period surprises.',
  },
};

export async function getCachedNarrative(
  db: Database,
  orgId: string,
  cacheKey: string,
): Promise<string | null> {
  const now = new Date();
  const [row] = await db
    .select()
    .from(narrativeCache)
    .where(
      and(
        eq(narrativeCache.orgId, orgId),
        eq(narrativeCache.cacheKey, cacheKey),
        or(isNull(narrativeCache.expiresAt), gt(narrativeCache.expiresAt, now)),
      ),
    )
    .limit(1);
  return row?.content ?? null;
}

export async function setCachedNarrative(
  db: Database,
  orgId: string,
  cacheKey: string,
  content: string,
  ttlHours = 24,
) {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  const existing = await getCachedNarrative(db, orgId, cacheKey);
  if (existing) {
    await db
      .update(narrativeCache)
      .set({ content, expiresAt })
      .where(and(eq(narrativeCache.orgId, orgId), eq(narrativeCache.cacheKey, cacheKey)));
    return;
  }
  await db.insert(narrativeCache).values({ orgId, cacheKey, content, expiresAt });
}

export async function buildSessionNarrative(db: Database, orgId: string): Promise<NarrativeResult> {
  const cacheKey = 'session';
  const cached = await getCachedNarrative(db, orgId, cacheKey);
  if (cached) {
    return { content: cached, cacheKey, links: [{ route: '/app/insights', label: 'Insights' }] };
  }

  const [snapshot] = await db
    .select()
    .from(dailyOrgSnapshots)
    .where(eq(dailyOrgSnapshots.orgId, orgId))
    .orderBy(desc(dailyOrgSnapshots.snapshotDate))
    .limit(1);

  const recentInsights = await db.select().from(insights).where(eq(insights.orgId, orgId)).limit(2);

  const nw = snapshot ? parseDecimal(snapshot.netWorth) : 0;
  const parts: string[] = [];
  if (nw > 0) {
    parts.push(`Your net worth stands at $${nw.toLocaleString()}.`);
  }
  if (recentInsights.length) {
    parts.push(`You have ${recentInsights.length} recent insight${recentInsights.length > 1 ? 's' : ''} to review.`);
  }
  if (parts.length === 0) {
    parts.push('Welcome back. Link accounts or complete setup to unlock personalized narratives.');
  }

  const content = parts.join(' ');
  await setCachedNarrative(db, orgId, cacheKey, content, 4);

  return {
    content,
    cacheKey,
    links: [
      { route: '/app', label: 'Dashboard' },
      { route: '/app/insights', label: 'Insights' },
    ],
  };
}

export async function buildPageNarrative(db: Database, orgId: string, route: string): Promise<NarrativeResult> {
  const normalized = route.split('?')[0] ?? route;
  const cacheKey = `page:${normalized}`;
  const cached = await getCachedNarrative(db, orgId, cacheKey);
  if (cached) {
    return { content: cached, cacheKey, links: [{ route: normalized, label: 'This page' }] };
  }

  const pageLabels: Record<string, string> = {
    '/app': 'dashboard',
    '/app/budgets': 'budgets',
    '/app/transactions': 'transactions',
    '/app/debt': 'debt',
    '/app/net-worth': 'net worth',
    '/app/retirement': 'retirement plan',
    '/app/inbox': 'inbox',
    '/app/insights': 'insights',
  };

  const label = pageLabels[normalized] ?? 'finances';
  const [snapshot] = await db
    .select()
    .from(dailyOrgSnapshots)
    .where(eq(dailyOrgSnapshots.orgId, orgId))
    .orderBy(desc(dailyOrgSnapshots.snapshotDate))
    .limit(1);

  let content = `Your ${label} story this month: `;
  if (snapshot) {
    const income = parseDecimal(snapshot.incomeMtd);
    const expenses = parseDecimal(snapshot.expensesMtd);
    if (income > 0) {
      content += `income $${income.toLocaleString()}, expenses $${expenses.toLocaleString()}. `;
    }
  }
  content += 'Review priority actions above to stay on track.';

  await setCachedNarrative(db, orgId, cacheKey, content);
  return { content, cacheKey, links: [{ route: normalized, label: pageLabels[normalized] ?? 'Page' }] };
}

export async function explainMetric(
  db: Database,
  orgId: string,
  metric: string,
): Promise<ExplainResult> {
  const meta = METRIC_EXPLAIN[metric] ?? {
    title: metric.replace(/_/g, ' '),
    definition: 'A key financial metric for your situation.',
    benchmark: 'Compare trends over time rather than single snapshots.',
  };

  const [snapshot] = await db
    .select()
    .from(dailyOrgSnapshots)
    .where(eq(dailyOrgSnapshots.orgId, orgId))
    .orderBy(desc(dailyOrgSnapshots.snapshotDate))
    .limit(1);

  let yourValue = 'Not enough data yet';
  let whatChanged: string | undefined;
  let suggestedAction: string | undefined;

  if (snapshot) {
    if (metric === 'net_worth') {
      yourValue = `$${parseDecimal(snapshot.netWorth).toLocaleString()}`;
      suggestedAction = 'View net worth history for trend analysis.';
    } else if (metric === 'savings_rate') {
      const income = parseDecimal(snapshot.incomeMtd);
      const savings = parseDecimal(snapshot.savingsMtd);
      const rate = income > 0 ? (savings / income) * 100 : 0;
      yourValue = `${rate.toFixed(1)}% this month`;
      suggestedAction = rate < 15 ? 'Consider increasing budget allocations to savings.' : 'Strong savings pace — review investment allocation.';
    } else if (metric === 'budget_pace') {
      yourValue = 'See budget page for category-level pace';
      suggestedAction = 'Open budgets to adjust categories over pace.';
    }
  }

  return {
    metric,
    title: meta.title,
    definition: meta.definition,
    yourValue,
    benchmark: meta.benchmark,
    whatChanged,
    suggestedAction,
  };
}
