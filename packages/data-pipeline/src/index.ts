import { EVENT_TYPES } from '@pf/events';
import { registerEventHandler } from './event-handler-registry';
import { handleCategoryCorrected } from './handlers/category-corrected';
import { handleInsightFeedback } from './handlers/insight-feedback';
import { handlePlaidSyncCompleted } from './handlers/plaid-sync-completed';

registerEventHandler(EVENT_TYPES.CATEGORY_CORRECTED, handleCategoryCorrected);
registerEventHandler(EVENT_TYPES.INSIGHT_FEEDBACK, handleInsightFeedback);
registerEventHandler(EVENT_TYPES.PLAID_SYNC_COMPLETED, handlePlaidSyncCompleted);

export {
  registerEventHandler,
  processDomainEvent,
  processPendingDomainEvents,
  getRegisteredEventTypes,
  type DomainEventRow,
  type EventHandler,
  type EventHandlerResult,
} from './event-handler-registry';
