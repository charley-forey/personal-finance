import { eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { automationRules, insights, notifications, plaidItems, userSignals } from '@pf/database';
import type { DomainEventRow, EventHandlerResult } from '../event-handler-registry';

interface PlaidSyncPayload {
  transactionsAdded?: number;
  transactionsModified?: number;
  transactionsRemoved?: number;
  accountsUpdated?: number;
}

export async function handlePlaidSyncCompleted(
  db: Database,
  event: DomainEventRow,
): Promise<EventHandlerResult> {
  const payload = event.payloadJson as PlaidSyncPayload;
  const itemId = event.aggregateId;

  const [item] = await db
    .select({
      institutionName: plaidItems.institutionName,
      syncStatus: plaidItems.syncStatus,
      lastSyncedAt: plaidItems.lastSyncedAt,
    })
    .from(plaidItems)
    .where(eq(plaidItems.id, itemId))
    .limit(1);

  await db.insert(userSignals).values({
    orgId: event.orgId,
    signalType: 'plaid_sync_completed',
    entityType: 'plaid_item',
    entityId: itemId,
    payloadJson: {
      institutionName: item?.institutionName,
      ...payload,
    },
  });

  const syncContext: Record<string, unknown> = {
    transactionsAdded: payload.transactionsAdded ?? 0,
    transactionsModified: payload.transactionsModified ?? 0,
    amount: payload.transactionsAdded,
    category: item?.institutionName,
  };

  const rules = await db
    .select()
    .from(automationRules)
    .where(eq(automationRules.orgId, event.orgId));

  let rulesTriggered = 0;
  for (const rule of rules) {
    if (!rule.enabled || rule.triggerType !== event.eventType) continue;

    const conditions = rule.triggerConditionsJson ?? {};
    let matches = true;

    if (conditions.minAmount && typeof syncContext.amount === 'number') {
      matches = matches && Math.abs(syncContext.amount) >= (conditions.minAmount as number);
    }

    if (!matches) continue;

    const action = rule.actionConfigJson ?? {};
    if (rule.actionType === 'create_insight') {
      await db.insert(insights).values({
        orgId: event.orgId,
        insightType: 'trend',
        title: (action.title as string) ?? rule.name,
        body: (action.body as string) ?? `Sync completed for ${item?.institutionName ?? 'linked account'}.`,
      });
    } else if (rule.actionType === 'notify') {
      await db.insert(notifications).values({
        orgId: event.orgId,
        channel: 'in_app',
        type: event.eventType,
        title: (action.title as string) ?? rule.name,
        body: (action.body as string) ?? 'Account sync completed.',
        sentAt: new Date(),
      });
    }

    await db
      .update(automationRules)
      .set({
        triggerCount: (rule.triggerCount ?? 0) + 1,
        lastTriggeredAt: new Date(),
      })
      .where(eq(automationRules.id, rule.id));

    rulesTriggered++;
  }

  return {
    action: 'plaid_sync_processed',
    details: {
      itemId,
      institutionName: item?.institutionName,
      rulesTriggered,
      transactionsAdded: payload.transactionsAdded ?? 0,
    },
  };
}
