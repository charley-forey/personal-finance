import { eq, and, isNull, sql } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { categoryGroups, categories, categoryRules, transactions } from '@pf/database';

const DEFAULT_CATEGORIES: Array<{ group: string; type: string; items: Array<{ name: string; plaid: string[]; pnlKey?: string }> }> = [
  {
    group: 'Income',
    type: 'income',
    items: [
      { name: 'Salary', plaid: ['INCOME', 'INCOME_WAGES'], pnlKey: 'salary' },
      { name: 'Freelance', plaid: ['INCOME', 'INCOME_OTHER_INCOME'], pnlKey: 'freelance' },
      { name: 'Investment Income', plaid: ['INCOME', 'INCOME_DIVIDENDS'], pnlKey: 'investment_income' },
      { name: 'Other Income', plaid: ['INCOME'], pnlKey: 'other_income' },
    ],
  },
  {
    group: 'Housing',
    type: 'expense',
    items: [
      { name: 'Rent/Mortgage', plaid: ['RENT_AND_UTILITIES', 'RENT_AND_UTILITIES_RENT'], pnlKey: 'housing' },
      { name: 'Utilities', plaid: ['RENT_AND_UTILITIES', 'RENT_AND_UTILITIES_GAS_AND_ELECTRICITY'], pnlKey: 'utilities' },
    ],
  },
  {
    group: 'Food',
    type: 'expense',
    items: [
      { name: 'Groceries', plaid: ['FOOD_AND_DRINK', 'FOOD_AND_DRINK_GROCERIES'], pnlKey: 'groceries' },
      { name: 'Dining Out', plaid: ['FOOD_AND_DRINK', 'FOOD_AND_DRINK_RESTAURANT'], pnlKey: 'dining' },
    ],
  },
  {
    group: 'Transportation',
    type: 'expense',
    items: [
      { name: 'Gas', plaid: ['TRANSPORTATION', 'TRANSPORTATION_GAS'], pnlKey: 'transportation' },
      { name: 'Public Transit', plaid: ['TRANSPORTATION', 'TRANSPORTATION_PUBLIC_TRANSIT'], pnlKey: 'transportation' },
    ],
  },
  {
    group: 'Shopping',
    type: 'expense',
    items: [
      { name: 'General Merchandise', plaid: ['GENERAL_MERCHANDISE'], pnlKey: 'shopping' },
      { name: 'Clothing', plaid: ['GENERAL_MERCHANDISE', 'GENERAL_MERCHANDISE_CLOTHING_AND_ACCESSORIES'], pnlKey: 'shopping' },
    ],
  },
  {
    group: 'Entertainment',
    type: 'expense',
    items: [{ name: 'Entertainment', plaid: ['ENTERTAINMENT'], pnlKey: 'entertainment' }],
  },
  {
    group: 'Healthcare',
    type: 'expense',
    items: [{ name: 'Medical', plaid: ['MEDICAL'], pnlKey: 'healthcare' }],
  },
  {
    group: 'Financial',
    type: 'expense',
    items: [
      { name: 'Fees', plaid: ['BANK_FEES'], pnlKey: 'fees' },
      { name: 'Loan Payments', plaid: ['LOAN_PAYMENTS'], pnlKey: 'debt_payments' },
    ],
  },
  {
    group: 'Transfers',
    type: 'transfer',
    items: [{ name: 'Transfer', plaid: ['TRANSFER_IN', 'TRANSFER_OUT'], pnlKey: 'transfers' }],
  },
  {
    group: 'Uncategorized',
    type: 'expense',
    items: [{ name: 'Uncategorized', plaid: [], pnlKey: 'other' }],
  },
];

export async function seedDefaultCategories(db: Database, orgId: string) {
  const [existing] = await db.select().from(categories).where(eq(categories.orgId, orgId)).limit(1);
  if (existing) return;

  for (const groupDef of DEFAULT_CATEGORIES) {
    const [group] = await db
      .insert(categoryGroups)
      .values({ orgId, name: groupDef.group, type: groupDef.type })
      .returning();

    for (const item of groupDef.items) {
      await db.insert(categories).values({
        orgId,
        groupId: group!.id,
        name: item.name,
        pnlRowKey: item.pnlKey,
        plaidCategoryMapJson: item.plaid,
      });
    }
  }
}

export async function categorizeTransaction(db: Database, orgId: string, txnId: string) {
  const [txn] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, txnId), eq(transactions.orgId, orgId)))
    .limit(1);
  if (!txn || txn.categoryId) return;

  const rules = await db
    .select()
    .from(categoryRules)
    .where(eq(categoryRules.orgId, orgId))
    .orderBy(sql`${categoryRules.priority} DESC`);

  for (const rule of rules) {
    const match =
      rule.matchType === 'merchant_contains' &&
      (txn.merchantName?.toLowerCase().includes(rule.pattern.toLowerCase()) ||
        txn.name.toLowerCase().includes(rule.pattern.toLowerCase()));
    if (match && rule.categoryId) {
      await db.update(transactions).set({ categoryId: rule.categoryId }).where(eq(transactions.id, txnId));
      return;
    }
  }

  const allCategories = await db.select().from(categories).where(eq(categories.orgId, orgId));
  const primary = txn.plaidCategoryPrimary ?? '';
  const detailed = txn.plaidCategoryDetailed ?? '';

  for (const cat of allCategories) {
    const maps = cat.plaidCategoryMapJson ?? [];
    if (maps.some((m) => primary.includes(m) || detailed.includes(m))) {
      await db.update(transactions).set({ categoryId: cat.id }).where(eq(transactions.id, txnId));
      return;
    }
  }

  const uncategorized = allCategories.find((c) => c.name === 'Uncategorized');
  if (uncategorized) {
    await db.update(transactions).set({ categoryId: uncategorized.id }).where(eq(transactions.id, txnId));
  }
}

export async function categorizeOrgTransactions(db: Database, orgId: string) {
  const uncategorized = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.orgId, orgId), isNull(transactions.categoryId), eq(transactions.isDeleted, false)))
    .limit(500);

  for (const txn of uncategorized) {
    await categorizeTransaction(db, orgId, txn.id);
  }
  return uncategorized.length;
}

export async function getInboxItems(db: Database, orgId: string) {
  const uncategorized = await db
    .select()
    .from(transactions)
    .where(
      and(eq(transactions.orgId, orgId), isNull(transactions.categoryId), eq(transactions.isDeleted, false)),
    )
    .limit(50);

  const largeTxns = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.orgId, orgId),
        eq(transactions.isDeleted, false),
        sql`ABS(${transactions.amount}::numeric) > 500`,
      ),
    )
    .limit(20);

  return {
    uncategorized,
    anomalies: largeTxns.filter((t) => !uncategorized.find((u) => u.id === t.id)),
  };
}
