import { eq, and, desc, gte } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  accounts,
  plaidItems,
  recurringStreams,
  changeEvents,
} from '@pf/database';
import { PLAID_STALE_MS, purposeFromAccount, parseDecimal } from '@pf/shared';
import { getLatestHoldings } from './plaid-sync.js';

export interface DataQualityScorecard {
  totalAccounts: number;
  visibleAccounts: number;
  healthyItems: number;
  totalItems: number;
  staleItems: number;
  loginRequiredItems: number;
  errorItems: number;
  itemsWithWarnings: number;
  accountsByPurpose: Record<string, number>;
  holdingsCoverage: { investmentAccounts: number; withHoldings: number };
  score: number;
  issues: string[];
}

export async function getDataQualityScorecard(db: Database, orgId: string): Promise<DataQualityScorecard> {
  const accts = await db.select().from(accounts).where(eq(accounts.orgId, orgId));
  const items = await db.select().from(plaidItems).where(eq(plaidItems.orgId, orgId));
  const latestHoldings = await getLatestHoldings(db, orgId);
  const accountsWithHoldings = new Set(latestHoldings.map((h) => h.accountId));

  const issues: string[] = [];
  let healthyItems = 0;
  let staleItems = 0;
  let loginRequiredItems = 0;
  let errorItems = 0;
  let itemsWithWarnings = 0;

  for (const item of items) {
    const stale =
      !item.lastSyncedAt || Date.now() - item.lastSyncedAt.getTime() > PLAID_STALE_MS;
    if (item.loginRequired) {
      loginRequiredItems++;
      issues.push(`${item.institutionName ?? 'Item'} needs reconnection`);
    }
    if (item.syncStatus === 'error' || item.errorCode) {
      errorItems++;
      issues.push(`${item.institutionName ?? 'Item'} sync error: ${item.errorCode ?? item.syncStatus}`);
    }
    if (stale && !item.loginRequired) {
      staleItems++;
      issues.push(`${item.institutionName ?? 'Item'} data may be stale`);
    }
    if ((item.syncWarnings?.length ?? 0) > 0) {
      itemsWithWarnings++;
      for (const w of item.syncWarnings ?? []) {
        if (w.startsWith('investments:') || w.startsWith('liabilities:')) {
          issues.push(`${item.institutionName ?? 'Item'}: ${w} — re-link with investments/liabilities products if needed`);
        }
      }
    }
    if (item.syncStatus === 'success' && !item.loginRequired && !item.errorCode && !stale) {
      healthyItems++;
    }
  }

  const accountsByPurpose: Record<string, number> = {};
  let investmentAccounts = 0;
  let withHoldings = 0;
  for (const a of accts) {
    if (a.isHidden) continue;
    const purpose = purposeFromAccount(a);
    accountsByPurpose[purpose] = (accountsByPurpose[purpose] ?? 0) + 1;
    if (purpose === 'brokerage' || purpose === 'retirement') {
      investmentAccounts++;
      if (accountsWithHoldings.has(a.id)) withHoldings++;
    }
  }

  if (investmentAccounts > 0 && withHoldings === 0) {
    issues.push('Investment accounts linked but no holdings synced — enable investments product and re-link');
  }

  const visibleAccounts = accts.filter((a) => !a.isHidden).length;
  const totalItems = items.length || 1;
  const score = Math.round(
    (healthyItems / totalItems) * 70 +
      (investmentAccounts === 0 || withHoldings === investmentAccounts ? 20 : (withHoldings / investmentAccounts) * 20) +
      (errorItems === 0 && loginRequiredItems === 0 ? 10 : 0),
  );

  return {
    totalAccounts: accts.length,
    visibleAccounts,
    healthyItems,
    totalItems: items.length,
    staleItems,
    loginRequiredItems,
    errorItems,
    itemsWithWarnings,
    accountsByPurpose,
    holdingsCoverage: { investmentAccounts, withHoldings },
    score: Math.min(100, Math.max(0, score)),
    issues: issues.slice(0, 20),
  };
}

export async function getRecentMoneyChanges(db: Database, orgId: string, sinceHours = 48) {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
  return db
    .select()
    .from(changeEvents)
    .where(and(eq(changeEvents.orgId, orgId), gte(changeEvents.detectedAt, since)))
    .orderBy(desc(changeEvents.detectedAt))
    .limit(50);
}

export async function detectSubscriptionPriceHikes(db: Database, orgId: string) {
  const streams = await db
    .select()
    .from(recurringStreams)
    .where(and(eq(recurringStreams.orgId, orgId), eq(recurringStreams.isActive, true)));

  const hikes: Array<{ id: string; description: string; lastAmount: number; averageAmount: number; pct: number }> =
    [];
  for (const s of streams) {
    const last = parseDecimal(s.lastAmount);
    const avg = parseDecimal(s.averageAmount);
    if (avg > 0 && last > 0 && last / avg >= 1.1) {
      hikes.push({
        id: s.id,
        description: s.description ?? 'Subscription',
        lastAmount: last,
        averageAmount: avg,
        pct: ((last / avg - 1) * 100),
      });
    }
  }
  return hikes;
}
