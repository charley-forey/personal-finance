import { Worker, Queue } from 'bullmq';

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

export function createWorkers(handlers: {
  onPlaidSync: (job: { data: { itemId: string; orgId: string } }) => Promise<void>;
  onRollup: (job: { data: { orgId: string } }) => Promise<void>;
  onInsight: (job: { data: { orgId: string } }) => Promise<void>;
}) {
  const plaidWorker = new Worker(
    QUEUES.PLAID_SYNC,
    async (job) => handlers.onPlaidSync(job),
    { connection },
  );

  const rollupWorker = new Worker(
    QUEUES.ROLLUP,
    async (job) => handlers.onRollup(job),
    { connection },
  );

  const insightWorker = new Worker(
    QUEUES.INSIGHTS,
    async (job) => handlers.onInsight(job),
    { connection },
  );

  return { plaidWorker, rollupWorker, insightWorker };
}
