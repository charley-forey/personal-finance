import { eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { automationRules, notificationRules, notifications, insights } from '@pf/database';
import { EVENT_TYPES } from '@pf/events';

export async function evaluateAutomationRules(
  db: Database,
  orgId: string,
  triggerType: string,
  context: Record<string, unknown>,
) {
  const rules = await db
    .select()
    .from(automationRules)
    .where(eq(automationRules.orgId, orgId));

  const triggered: string[] = [];

  for (const rule of rules) {
    if (!rule.enabled || rule.triggerType !== triggerType) continue;

    const conditions = rule.triggerConditionsJson ?? {};
    let matches = true;

    if (conditions.minAmount && typeof context.amount === 'number') {
      matches = matches && Math.abs(context.amount) >= (conditions.minAmount as number);
    }
    if (conditions.category && context.category) {
      matches = matches && context.category === conditions.category;
    }

    if (!matches) continue;

    const action = rule.actionConfigJson ?? {};
    if (rule.actionType === 'create_insight') {
      await db.insert(insights).values({
        orgId,
        insightType: 'warning',
        title: (action.title as string) ?? rule.name,
        body: (action.body as string) ?? `Rule "${rule.name}" triggered`,
      });
    } else if (rule.actionType === 'notify') {
      await db.insert(notifications).values({
        orgId,
        channel: 'in_app',
        type: triggerType,
        title: (action.title as string) ?? rule.name,
        body: (action.body as string) ?? `Automation rule triggered`,
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

    triggered.push(rule.id);
  }

  return triggered;
}

export async function evaluateNotificationRules(
  db: Database,
  orgId: string,
  eventType: string,
  payload: Record<string, unknown>,
) {
  const rules = await db
    .select()
    .from(notificationRules)
    .where(eq(notificationRules.orgId, orgId));

  for (const rule of rules) {
    if (!rule.enabled || rule.ruleType !== eventType) continue;

    const channels = rule.channelsJson ?? ['in_app'];
    for (const channel of channels) {
      await db.insert(notifications).values({
        orgId,
        channel: channel as 'in_app',
        type: eventType,
        title: `Notification: ${eventType}`,
        body: JSON.stringify(payload),
        sentAt: new Date(),
      });
    }
  }
}

export async function checkBudgetExceeded(db: Database, orgId: string, budgetId: string, spent: number, limit: number) {
  if (spent <= limit) return;
  await evaluateNotificationRules(db, orgId, EVENT_TYPES.BUDGET_EXCEEDED, {
    budgetId,
    spent,
    limit,
    overage: spent - limit,
  });
  await evaluateAutomationRules(db, orgId, EVENT_TYPES.BUDGET_EXCEEDED, { spent, limit });
}
