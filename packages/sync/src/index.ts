export { syncPlaidItem, processDomainEvents, type SyncResult } from './plaid-sync';
export { seedDefaultCategories, categorizeTransaction, categorizeOrgTransactions, getInboxItems } from './categories';
export { computeDailySnapshot, computeBudgetActuals, getNetWorth, getCashFlowFromData, populatePnlActuals } from './analytics';
export { evaluateAutomationRules, evaluateNotificationRules, checkBudgetExceeded } from './rules';
export { ingestKnowledgeBase, searchKnowledge } from './knowledge';
export { runPostSyncIntelligence, type PostSyncResult, type PostSyncNotification } from './intelligence';
