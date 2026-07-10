import { EVENT_TYPES } from '@pf/events';
import { registerEventHandler } from './event-handler-registry';
import { handleCategoryCorrected } from './handlers/category-corrected';
import { handleInsightFeedback } from './handlers/insight-feedback';
import { handlePlaidSyncCompleted } from './handlers/plaid-sync-completed';
import { handleRecommendationCompleted } from './handlers/recommendation-completed';
import { handleSignalAck } from './handlers/signal-ack';

registerEventHandler(EVENT_TYPES.CATEGORY_CORRECTED, handleCategoryCorrected);
registerEventHandler(EVENT_TYPES.INSIGHT_FEEDBACK, handleInsightFeedback);
registerEventHandler(EVENT_TYPES.PLAID_SYNC_COMPLETED, handlePlaidSyncCompleted);
registerEventHandler(EVENT_TYPES.RECOMMENDATION_COMPLETED, handleRecommendationCompleted);

registerEventHandler(EVENT_TYPES.BUDGET_EXCEEDED, (db, event) =>
  handleSignalAck(db, event, 'budget_exceeded'),
);
registerEventHandler(EVENT_TYPES.GOAL_ACHIEVED, (db, event) =>
  handleSignalAck(db, event, 'goal_achieved'),
);
registerEventHandler(EVENT_TYPES.INSIGHT_GENERATED, (db, event) =>
  handleSignalAck(db, event, 'insight_generated'),
);
registerEventHandler(EVENT_TYPES.RECOMMENDATION_CREATED, (db, event) =>
  handleSignalAck(db, event, 'recommendation_created'),
);
registerEventHandler(EVENT_TYPES.FORECAST_GENERATED, (db, event) =>
  handleSignalAck(db, event, 'forecast_generated'),
);

export {
  registerEventHandler,
  processDomainEvent,
  processPendingDomainEvents,
  getRegisteredEventTypes,
  type DomainEventRow,
  type EventHandler,
  type EventHandlerResult,
} from './event-handler-registry';
