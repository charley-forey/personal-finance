import { and, eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { categoryRules, userSignals } from '@pf/database';
import type { DomainEventRow, EventHandlerResult } from '../event-handler-registry';

interface CategoryCorrectedPayload {
  transactionId?: string;
  priorCategoryId?: string | null;
  newCategoryId?: string;
  merchantName?: string | null;
  userId?: string;
}

export async function handleCategoryCorrected(
  db: Database,
  event: DomainEventRow,
): Promise<EventHandlerResult> {
  const payload = event.payloadJson as CategoryCorrectedPayload;
  const userId = payload.userId ?? (event.metadataJson?.userId as string | undefined);

  await db.insert(userSignals).values({
    orgId: event.orgId,
    userId,
    signalType: 'category_correction',
    entityType: 'transaction',
    entityId: payload.transactionId ?? event.aggregateId,
    payloadJson: {
      priorCategoryId: payload.priorCategoryId,
      newCategoryId: payload.newCategoryId,
      merchantName: payload.merchantName,
    },
  });

  let ruleCreated = false;
  const merchant = payload.merchantName?.trim();
  if (merchant && payload.newCategoryId) {
    const pattern = merchant.toLowerCase();
    const [existing] = await db
      .select({ id: categoryRules.id })
      .from(categoryRules)
      .where(
        and(
          eq(categoryRules.orgId, event.orgId),
          eq(categoryRules.matchType, 'contains'),
          eq(categoryRules.pattern, pattern),
        ),
      )
      .limit(1);

    if (!existing) {
      await db.insert(categoryRules).values({
        orgId: event.orgId,
        matchType: 'contains',
        pattern,
        categoryId: payload.newCategoryId,
        priority: 10,
      });
      ruleCreated = true;
    }
  }

  return {
    action: 'category_correction_processed',
    details: { ruleCreated, transactionId: payload.transactionId },
  };
}
