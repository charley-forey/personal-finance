import { and, eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { recommendationItems, recommendationOutcomes, userSignals } from '@pf/database';
import type { DomainEventRow, EventHandlerResult } from '../event-handler-registry';

interface RecommendationCompletedPayload {
  recommendationId?: string;
  outcome?: string;
  notes?: string;
  userId?: string;
}

export async function handleRecommendationCompleted(
  db: Database,
  event: DomainEventRow,
): Promise<EventHandlerResult> {
  const payload = event.payloadJson as RecommendationCompletedPayload;
  const recommendationId = payload.recommendationId ?? event.aggregateId;
  const outcome = payload.outcome ?? 'completed';
  const userId = payload.userId ?? (event.metadataJson?.userId as string | undefined);

  await db.insert(recommendationOutcomes).values({
    orgId: event.orgId,
    recommendationId,
    outcome,
    notes: payload.notes,
  });

  await db
    .update(recommendationItems)
    .set({ status: outcome === 'dismissed' ? 'dismissed' : 'completed' })
    .where(
      and(eq(recommendationItems.id, recommendationId), eq(recommendationItems.orgId, event.orgId)),
    );

  await db.insert(userSignals).values({
    orgId: event.orgId,
    userId,
    signalType: 'recommendation_completed',
    entityType: 'recommendation',
    entityId: recommendationId,
    payloadJson: { outcome, notes: payload.notes },
  });

  return {
    action: 'recommendation_completed_processed',
    details: { recommendationId, outcome },
  };
}
