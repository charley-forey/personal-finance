import { eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { recommendationItems, plaidItems } from '@pf/database';
import type { PostSyncResult } from './intelligence.js';
import { detectSubscriptionPriceHikes } from './data-quality.js';
import { PLAID_STALE_MS } from '@pf/shared';

/**
 * Turn post-sync signals into Action Queue recommendation rows.
 */
export async function buildActionQueueFromSync(
  db: Database,
  orgId: string,
  intel: PostSyncResult,
): Promise<{ created: number }> {
  let created = 0;

  for (const breach of intel.budgetBreaches.slice(0, 5)) {
    await db.insert(recommendationItems).values({
      orgId,
      actionType: 'budget_breach',
      title: `Review ${breach.categoryName} budget`,
      body: `Spent $${breach.spent.toFixed(0)} of $${breach.limit.toFixed(0)}. Adjust spending or raise the budget.`,
      priorityScore: '90',
      confidence: '0.85',
      status: 'pending',
      metadataJson: { budgetId: breach.budgetId, source: 'plaid_sync' },
    });
    created++;
  }

  for (const txn of intel.largeTransactions.slice(0, 3)) {
    await db.insert(recommendationItems).values({
      orgId,
      actionType: 'large_transaction',
      title: `Large charge: ${txn.name}`,
      body: `$${txn.amount.toFixed(0)} on ${txn.date}. Confirm this was expected.`,
      priorityScore: '70',
      confidence: '0.8',
      status: 'pending',
      metadataJson: { transactionId: txn.id, source: 'plaid_sync' },
    });
    created++;
  }

  const hikes = await detectSubscriptionPriceHikes(db, orgId);
  for (const hike of hikes.slice(0, 5)) {
    await db.insert(recommendationItems).values({
      orgId,
      actionType: 'subscription_price_hike',
      title: `Price increase: ${hike.description}`,
      body: `Up ${hike.pct.toFixed(0)}% ($${hike.averageAmount.toFixed(2)} → $${hike.lastAmount.toFixed(2)}). Consider canceling or negotiating.`,
      priorityScore: '65',
      confidence: '0.75',
      status: 'pending',
      metadataJson: { streamId: hike.id, source: 'plaid_sync' },
    });
    created++;
  }

  const items = await db.select().from(plaidItems).where(eq(plaidItems.orgId, orgId));
  for (const item of items) {
    if (item.loginRequired) {
      await db.insert(recommendationItems).values({
        orgId,
        actionType: 'reconnect_bank',
        title: `Reconnect ${item.institutionName ?? 'bank'}`,
        body: 'Login required to keep balances and transactions up to date.',
        priorityScore: '95',
        confidence: '1',
        status: 'pending',
        metadataJson: { itemId: item.id, source: 'plaid_sync' },
      });
      created++;
    } else if (!item.lastSyncedAt || Date.now() - item.lastSyncedAt.getTime() > PLAID_STALE_MS) {
      await db.insert(recommendationItems).values({
        orgId,
        actionType: 'stale_sync',
        title: `Sync ${item.institutionName ?? 'accounts'}`,
        body: 'Data may be stale. Run Sync now or wait for the next webhook.',
        priorityScore: '40',
        confidence: '0.9',
        status: 'pending',
        metadataJson: { itemId: item.id, source: 'plaid_sync' },
      });
      created++;
    }

    const warnings = item.syncWarnings ?? [];
    if (warnings.some((w) => w.startsWith('investments:'))) {
      await db.insert(recommendationItems).values({
        orgId,
        actionType: 'upgrade_connection',
        title: `Enable investments for ${item.institutionName ?? 'this bank'}`,
        body: 'Holdings could not sync. Re-link this institution with the investments product to see brokerage/retirement positions.',
        priorityScore: '75',
        confidence: '0.9',
        status: 'pending',
        metadataJson: { itemId: item.id, source: 'plaid_sync' },
      });
      created++;
    }
  }

  return { created };
}
