import { eq, and, gte, desc } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  accounts,
  accountBalances,
  transactions,
  dailyOrgSnapshots,
  manualAssets,
  investmentHoldings,
  budgets,
  budgetActuals,
  categories,
  pnlCells,
} from '@pf/database';
import { convertCurrency, parseDecimal } from '@pf/shared';
import { checkBudgetExceeded } from './rules.js';

export async function getNetWorth(db: Database, orgId: string, targetCurrency = 'USD') {
  const accts = await db.select().from(accounts).where(eq(accounts.orgId, orgId));
  let totalAssets = 0;
  let totalLiabilities = 0;
  let cash = 0;
  let investments = 0;
  let creditDebt = 0;

  for (const acct of accts) {
    const [balance] = await db
      .select()
      .from(accountBalances)
      .where(eq(accountBalances.accountId, acct.id))
      .orderBy(desc(accountBalances.capturedAt))
      .limit(1);

    const accountCurrency = balance?.isoCurrencyCode ?? acct.currency ?? 'USD';
    const current = convertCurrency(parseDecimal(balance?.current), accountCurrency, targetCurrency);
    if (['credit', 'loan'].includes(acct.type)) {
      totalLiabilities += Math.abs(current);
      creditDebt += Math.abs(current);
    } else if (acct.type === 'investment') {
      investments += current;
      totalAssets += current;
    } else {
      cash += current;
      totalAssets += current;
    }
  }

  const holdings = await db.select().from(investmentHoldings).where(eq(investmentHoldings.orgId, orgId));
  for (const h of holdings) {
    const val = convertCurrency(parseDecimal(h.institutionValue), 'USD', targetCurrency);
    if (val > 0) {
      investments += val;
      totalAssets += val;
    }
  }

  const assets = await db.select().from(manualAssets).where(eq(manualAssets.orgId, orgId));
  for (const a of assets) {
    totalAssets += convertCurrency(parseDecimal(a.currentValue), 'USD', targetCurrency);
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    cash,
    investments,
    creditDebt,
    currency: targetCurrency,
  };
}

export async function computeDailySnapshot(db: Database, orgId: string) {
  const nw = await getNetWorth(db, orgId);
  const today = new Date().toISOString().split('T')[0]!;
  const monthStart = `${today.slice(0, 7)}-01`;

  const txns = await db
    .select()
    .from(transactions)
    .where(
      and(eq(transactions.orgId, orgId), gte(transactions.date, monthStart), eq(transactions.isDeleted, false)),
    );

  let incomeMtd = 0;
  let expensesMtd = 0;
  for (const t of txns) {
    const amt = parseDecimal(t.amount);
    if (amt < 0) incomeMtd += Math.abs(amt);
    else expensesMtd += amt;
  }

  await db
    .insert(dailyOrgSnapshots)
    .values({
      orgId,
      snapshotDate: today,
      totalAssets: nw.totalAssets.toString(),
      totalLiabilities: nw.totalLiabilities.toString(),
      netWorth: nw.netWorth.toString(),
      cash: nw.cash.toString(),
      investments: nw.investments.toString(),
      creditDebt: nw.creditDebt.toString(),
      incomeMtd: incomeMtd.toString(),
      expensesMtd: expensesMtd.toString(),
      savingsMtd: (incomeMtd - expensesMtd).toString(),
    })
    .onConflictDoUpdate({
      target: [dailyOrgSnapshots.orgId, dailyOrgSnapshots.snapshotDate],
      set: {
        totalAssets: nw.totalAssets.toString(),
        totalLiabilities: nw.totalLiabilities.toString(),
        netWorth: nw.netWorth.toString(),
        cash: nw.cash.toString(),
        investments: nw.investments.toString(),
        creditDebt: nw.creditDebt.toString(),
        incomeMtd: incomeMtd.toString(),
        expensesMtd: expensesMtd.toString(),
        savingsMtd: (incomeMtd - expensesMtd).toString(),
        computedAt: new Date(),
      },
    });

  return nw;
}

export async function computeBudgetActuals(db: Database, orgId: string) {
  const orgBudgets = await db.select().from(budgets).where(eq(budgets.orgId, orgId));

  for (const budget of orgBudgets) {
    if (!budget.categoryId) continue;

    const txns = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.orgId, orgId),
          eq(transactions.categoryId, budget.categoryId),
          gte(transactions.date, budget.periodStart),
          eq(transactions.isDeleted, false),
        ),
      );

    let spent = 0;
    for (const t of txns) {
      spent += parseDecimal(t.amount);
    }

    const budgetAmount = parseDecimal(budget.amount);
    const remaining = budgetAmount - spent;

    const [existing] = await db
      .select()
      .from(budgetActuals)
      .where(eq(budgetActuals.budgetId, budget.id))
      .limit(1);

    if (existing) {
      await db
        .update(budgetActuals)
        .set({ spent: spent.toString(), remaining: remaining.toString(), computedAt: new Date() })
        .where(eq(budgetActuals.id, existing.id));
    } else {
      await db.insert(budgetActuals).values({
        budgetId: budget.id,
        spent: spent.toString(),
        remaining: remaining.toString(),
      });
    }

    if (spent > budgetAmount) {
      await checkBudgetExceeded(db, orgId, budget.id, spent, budgetAmount);
    }
  }
}

export async function getCashFlowFromData(db: Database, orgId: string) {
  const recurring = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.orgId, orgId), eq(transactions.isDeleted, false)))
    .limit(1000);

  let income = 0;
  let expenses = 0;
  for (const t of recurring) {
    const amt = parseDecimal(t.amount);
    if (amt < 0) income += Math.abs(amt);
    else expenses += amt;
  }

  const monthCount = Math.max(1, new Set(recurring.map((t) => t.date.slice(0, 7))).size);
  return {
    monthlyIncome: income / monthCount,
    monthlyExpenses: expenses / monthCount,
    savingsRate: income > 0 ? (income - expenses) / income : 0,
  };
}

export async function populatePnlActuals(db: Database, orgId: string, periodId: string, year: number, month: number) {
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
  const monthEnd = new Date(year, month, 0).toISOString().split('T')[0]!;

  const cats = await db.select().from(categories).where(eq(categories.orgId, orgId));
  const txns = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.orgId, orgId),
        gte(transactions.date, monthStart),
        eq(transactions.isDeleted, false),
      ),
    );

  const totals = new Map<string, number>();
  for (const txn of txns) {
    if (txn.date > monthEnd) continue;
    const cat = cats.find((c) => c.id === txn.categoryId);
    const key = cat?.pnlRowKey ?? 'other';
    totals.set(key, (totals.get(key) ?? 0) + parseDecimal(txn.amount));
  }

  for (const [rowKey, value] of totals) {
    const existing = await db
      .select()
      .from(pnlCells)
      .where(and(eq(pnlCells.periodId, periodId), eq(pnlCells.rowKey, rowKey), eq(pnlCells.columnKey, 'actual')))
      .limit(1);

    if (existing[0]) {
      await db
        .update(pnlCells)
        .set({ value: value.toString(), source: 'computed' })
        .where(eq(pnlCells.id, existing[0].id));
    } else {
      await db.insert(pnlCells).values({
        periodId,
        rowKey,
        columnKey: 'actual',
        value: value.toString(),
        source: 'computed',
      });
    }
  }
}
