import type { Database } from '@pf/database';
import { userSignals } from '@pf/database';
import type { DomainEventRow, EventHandlerResult } from '../event-handler-registry';

/**
 * Lightweight ack handler: records a user_signal row for observability.
 * Safe no-op side effects beyond signal insert — suitable for events that
 * do not yet have domain-specific processing.
 */
export async function handleSignalAck(
  db: Database,
  event: DomainEventRow,
  signalType: string,
): Promise<EventHandlerResult> {
  const userId = event.metadataJson?.userId as string | undefined;
  await db.insert(userSignals).values({
    orgId: event.orgId,
    userId,
    signalType,
    entityType: event.aggregateType,
    entityId: event.aggregateId,
    payloadJson: (event.payloadJson as Record<string, unknown>) ?? {},
  });

  return {
    action: `${signalType}_acked`,
    details: { aggregateId: event.aggregateId },
  };
}
