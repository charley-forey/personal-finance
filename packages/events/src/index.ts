export const EVENT_TYPES = {
  PLAID_ITEM_LINKED: 'plaid.item.linked',
  PLAID_SYNC_COMPLETED: 'plaid.sync.completed',
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_UPDATED: 'transaction.updated',
  BALANCE_CHANGED: 'balance.changed',
  BUDGET_EXCEEDED: 'budget.exceeded',
  GOAL_ACHIEVED: 'goal.achieved',
  INSIGHT_GENERATED: 'insight.generated',
  HEALTH_SCORE_CHANGED: 'health_score.changed',
  USER_SIGNED_UP: 'user.signed_up',
  PNL_PERIOD_CLOSED: 'pnl.period.closed',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface DomainEvent<T = Record<string, unknown>> {
  id?: string;
  orgId: string;
  eventType: EventType;
  aggregateType: string;
  aggregateId: string;
  payload: T;
  metadata?: {
    source?: string;
    correlationId?: string;
    userId?: string;
  };
  occurredAt?: Date;
}

export function createEvent<T extends Record<string, unknown>>(
  params: Omit<DomainEvent<T>, 'occurredAt'>,
): DomainEvent<T> {
  return {
    ...params,
    occurredAt: new Date(),
  };
}
