import { eq, isNull } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { domainEvents } from '@pf/database';
import type { EventType } from '@pf/events';

export type DomainEventRow = typeof domainEvents.$inferSelect;

export interface EventHandlerResult {
  action: string;
  details?: Record<string, unknown>;
}

export type EventHandler = (db: Database, event: DomainEventRow) => Promise<EventHandlerResult>;

const handlers = new Map<EventType, EventHandler>();

export function registerEventHandler(eventType: EventType, handler: EventHandler): void {
  handlers.set(eventType, handler);
}

export function getRegisteredEventTypes(): EventType[] {
  return [...handlers.keys()];
}

export async function processDomainEvent(
  db: Database,
  event: DomainEventRow,
): Promise<EventHandlerResult | null> {
  const handler = handlers.get(event.eventType as EventType);
  if (!handler) return null;
  return handler(db, event);
}

export async function processPendingDomainEvents(db: Database, limit = 50): Promise<number> {
  const events = await db
    .select()
    .from(domainEvents)
    .where(isNull(domainEvents.processedAt))
    .limit(limit);

  for (const event of events) {
    await processDomainEvent(db, event);
    await db
      .update(domainEvents)
      .set({ processedAt: new Date() })
      .where(eq(domainEvents.id, event.id));
  }

  return events.length;
}
