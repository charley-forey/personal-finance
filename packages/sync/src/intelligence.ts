import { and, desc, eq, gte } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  budgetActuals,
  budgets,
  categories,
  insights,
  transactions,
} from '@pf/database';
import { EVENT_TYPES } from '@pf/events';
import { evaluateAutomationRules } from './rules';

const LARGE_TXN_THRESHOLD = 500;

function parseDecimal(value: string | null | undefined): number {
  if (!value) return 0;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export interface PostSyncNotification {
  type: string;
  title: string;
  body: string;
  notificationType?: string;
}

export interface PostSyncResult {
  syncContext: Record<string, unknown>;
  notifications: PostSyncNotification[];
  budgetBreaches: Array<{ budgetId: string; categoryName: string; spent: number; limit: number }>;
  largeTransactions: Array<{ id: string; name: string; amount: number; date: string }>;
}

export async function runPostSyncIntelligence(db: Database, orgId: string): Promise<PostSyncResult> {
  const notificationsOut: PostSyncNotification[] = [];
  const budgetBreaches: PostSyncResult['budgetBreaches'] = [];
  const largeTransactions: PostSyncResult['largeTransactions'] = [];

  const actuals = await db
    .select({
      budgetId: budgetActuals.budgetId,
      spent: budgetActuals.spent,
      remaining: budgetActuals.remaining,
      amount: budgets.amount,
      categoryId: budgets.categoryId,
    })
    .from(budgetActuals)
    .innerJoin(budgets, eq(budgets.id, budgetActuals.budgetId))
    .where(eq(budgets.orgId, orgId));

  for (const row of actuals) {
    const spent = parseDecimal(row.spent);
    const limit = parseDecimal(row.amount);
    if (spent <= limit) continue;

    let categoryName = 'Budget';
    if (row.categoryId) {
      const [cat] = await db.select().from(categories).where(eq(categories.id, row.categoryId)).limit(1);
      if (cat) categoryName = cat.name;
    }

    budgetBreaches.push({ budgetId: row.budgetId, categoryName, spent, limit });

    notificationsOut.push({
      type: 'budget_alert',
      notificationType: EVENT_TYPES.BUDGET_EXCEEDED,
      title: `Budget exceeded: ${categoryName}`,
      body: `You've spent $${spent.toFixed(0)} against a $${limit.toFixed(0)} budget (${((spent / limit - 1) * 100).toFixed(0)}% over).`,
    });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTxns = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.orgId, orgId), eq(transactions.isDeleted, false), gte(transactions.date, sevenDaysAgo.toISOString().slice(0, 10))))
    .orderBy(desc(transactions.date))
    .limit(100);

  for (const txn of recentTxns) {
    const amount = Math.abs(parseDecimal(txn.amount));
    if (amount < LARGE_TXN_THRESHOLD) continue;
    largeTransactions.push({
      id: txn.id,
      name: txn.name ?? txn.merchantName ?? 'Transaction',
      amount,
      date: txn.date,
    });
  }

  if (budgetBreaches.length > 0 && largeTransactions.length > 0) {
    const topBreach = budgetBreaches[0]!;
    const topTxn = largeTransactions[0]!;
    const title = 'Spending alert: budget breach + large transaction';
    const body = `Your ${topBreach.categoryName} budget is $${(topBreach.spent - topBreach.limit).toFixed(0)} over limit, and a recent $${topTxn.amount.toFixed(0)} charge to ${topTxn.name} may be related. Review spending to get back on track.`;

    await db.insert(insights).values({
      orgId,
      insightType: 'warning',
      title,
      body,
    });

    notificationsOut.push({
      type: 'proactive_insight',
      notificationType: EVENT_TYPES.INSIGHT_GENERATED,
      title,
      body,
    });
  }

  const syncContext: Record<string, unknown> = {
    budgetBreaches: budgetBreaches.length,
    largeTransactionCount: largeTransactions.length,
    largestTransaction: largeTransactions[0]?.amount,
    amount: largeTransactions[0]?.amount,
    category: budgetBreaches[0]?.categoryName,
  };

  await evaluateAutomationRules(db, orgId, EVENT_TYPES.PLAID_SYNC_COMPLETED, syncContext);

  return { syncContext, notifications: notificationsOut, budgetBreaches, largeTransactions };
}
