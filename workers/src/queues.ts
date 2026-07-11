import { Worker, Queue } from 'bullmq';
import { eq } from 'drizzle-orm';
import { createPlaidClient } from '@pf/plaid-client';
import { plaidItems } from '@pf/database';
import {
  syncPlaidItem,
  processDomainEvents,
  computeBudgetActuals,
  categorizeOrgTransactions,
  categorizeTransaction,
  runPostSyncIntelligence,
  buildActionQueueFromSync,
} from '@pf/sync';
import { decryptToken, requireEncryptionKey } from './crypto.js';

const connection = {
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  maxRetriesPerRequest: null,
};

export const QUEUES = {
  PLAID_SYNC: 'plaid-sync',
  ROLLUP: 'daily-rollup',
  INSIGHTS: 'ai-insights',
  NOTIFICATIONS: 'notifications',
} as const;

export const plaidSyncQueue = new Queue(QUEUES.PLAID_SYNC, { connection });
export const rollupQueue = new Queue(QUEUES.ROLLUP, { connection });
export const insightsQueue = new Queue(QUEUES.INSIGHTS, { connection });
export const notificationsQueue = new Queue(QUEUES.NOTIFICATIONS, { connection });

export function createWorkers(handlers: {
  onPlaidSync: (job: { data: { itemId: string; orgId: string } }) => Promise<void>;
  onRollup: (job: { data: { orgId: string } }) => Promise<void>;
  onInsight: (job: { data: { orgId: string } }) => Promise<void>;
  onNotification?: (job: { data: Record<string, unknown> }) => Promise<void>;
}) {
  const plaidWorker = new Worker(QUEUES.PLAID_SYNC, async (job) => handlers.onPlaidSync(job), { connection });
  const rollupWorker = new Worker(QUEUES.ROLLUP, async (job) => handlers.onRollup(job), { connection });
  const insightWorker = new Worker(QUEUES.INSIGHTS, async (job) => handlers.onInsight(job), { connection });
  const notificationWorker = handlers.onNotification
    ? new Worker(QUEUES.NOTIFICATIONS, async (job) => handlers.onNotification!(job), { connection })
    : null;

  return { plaidWorker, rollupWorker, insightWorker, notificationWorker };
}

export function createPlaidSyncHandler(db: ReturnType<typeof import('@pf/database').createDb>) {
  const plaid = createPlaidClient({
    clientId: process.env.PLAID_CLIENT_ID ?? '',
    secret: process.env.PLAID_SECRET ?? process.env.PLAID_SANDBOX_SECRET ?? '',
    env: (process.env.PLAID_ENV ?? 'sandbox') as 'sandbox',
    webhookUrl: process.env.PLAID_WEBHOOK_URL,
  });

  const key = requireEncryptionKey(process.env.TOKEN_ENCRYPTION_KEY, process.env.NODE_ENV ?? 'development');

  return async (job: { data: { itemId: string; orgId: string } }) => {
    if (process.env.PLAID_SYNC_ENABLED === 'false') {
      console.warn('PLAID_SYNC_ENABLED=false — skipping sync job', job.data.itemId);
      return;
    }

    const [item] = await db.select().from(plaidItems).where(eq(plaidItems.id, job.data.itemId));
    if (!item) return;

    try {
      const accessToken = decryptToken(item.accessTokenEncrypted, key);
      await syncPlaidItem(db, plaid, job.data.itemId, job.data.orgId, accessToken, {
        categorize: (oid, txnId) => categorizeTransaction(db, oid, txnId),
      });
      await categorizeOrgTransactions(db, job.data.orgId);
      await computeBudgetActuals(db, job.data.orgId);
      await processDomainEvents(db);

      const intel = await runPostSyncIntelligence(db, job.data.orgId);
      await buildActionQueueFromSync(db, job.data.orgId, intel);

      try {
        const { computeFeatureStore } = await import('@pf/intelligence');
        await computeFeatureStore(db, job.data.orgId);
      } catch (err) {
        console.warn('Feature store after sync failed', err);
      }

      for (const notif of intel.notifications) {
        await notificationsQueue.add('proactive', {
          orgId: job.data.orgId,
          type: notif.type,
          notificationType: notif.notificationType ?? notif.type,
          title: notif.title,
          body: notif.body,
          createInApp: true,
          sendEmail: false,
        });
      }
    } catch (err) {
      const code = err instanceof Error ? err.message.slice(0, 120) : 'SYNC_FAILED';
      await db
        .update(plaidItems)
        .set({ syncStatus: 'error', errorCode: code })
        .where(eq(plaidItems.id, job.data.itemId));
      throw err;
    }
  };
}
