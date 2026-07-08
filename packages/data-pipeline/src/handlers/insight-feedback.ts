import { and, eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { insightFeedback, insights, userSignals } from '@pf/database';
import type { DomainEventRow, EventHandlerResult } from '../event-handler-registry';

interface InsightFeedbackPayload {
  insightId?: string;
  helpful?: boolean;
  actedOn?: boolean;
  dismissed?: boolean;
  reason?: string;
  userId?: string;
  feedbackId?: string;
}

export async function handleInsightFeedback(
  db: Database,
  event: DomainEventRow,
): Promise<EventHandlerResult> {
  const payload = event.payloadJson as InsightFeedbackPayload;
  const userId = payload.userId ?? (event.metadataJson?.userId as string | undefined);
  const insightId = payload.insightId ?? event.aggregateId;

  if (payload.feedbackId) {
    const [existing] = await db
      .select({ id: insightFeedback.id })
      .from(insightFeedback)
      .where(and(eq(insightFeedback.id, payload.feedbackId), eq(insightFeedback.orgId, event.orgId)))
      .limit(1);

    if (!existing) {
      await db.insert(insightFeedback).values({
        orgId: event.orgId,
        userId,
        insightId,
        helpful: payload.helpful,
        actedOn: payload.actedOn,
        dismissed: payload.dismissed,
        reason: payload.reason,
      });
    }
  }

  if (payload.dismissed) {
    await db
      .update(insights)
      .set({ dismissedAt: new Date() })
      .where(and(eq(insights.id, insightId), eq(insights.orgId, event.orgId)));
  }

  await db.insert(userSignals).values({
    orgId: event.orgId,
    userId,
    signalType: 'insight_feedback',
    entityType: 'insight',
    entityId: insightId,
    payloadJson: {
      helpful: payload.helpful,
      actedOn: payload.actedOn,
      dismissed: payload.dismissed,
      reason: payload.reason,
    },
  });

  return {
    action: 'insight_feedback_processed',
    details: { insightId, helpful: payload.helpful },
  };
}
