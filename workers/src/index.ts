import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { createWorkers, createPlaidSyncHandler, rollupQueue, insightsQueue, notificationsQueue, plaidSyncQueue } from './queues.js';
import { createDb } from '@pf/database';
import { organizations, plaidItems } from '@pf/database';
import { PLAID_STALE_MS } from '@pf/shared';
import {
  computeDailySnapshot,
  computeBudgetActuals,
  processDomainEvents,
  ingestKnowledgeBase,
} from '@pf/sync';
import { createOpenAIClient, generateEmbedding } from '@pf/ai';
import { handleNotificationJob } from './notifications.js';

loadEnv({ path: resolve(process.cwd(), '../.env') });

const db = createDb(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/personal_finance');

console.log('Starting Personal Finance OS workers...');

const plaidSyncHandler = createPlaidSyncHandler(db);

createWorkers({
  onPlaidSync: plaidSyncHandler,
  onRollup: async (job) => {
    console.log(`Daily rollup for org ${job.data.orgId}`);
    await computeDailySnapshot(db, job.data.orgId);
    await computeBudgetActuals(db, job.data.orgId);
    await processDomainEvents(db);
    const { computeFeatureStore } = await import('@pf/intelligence');
    await computeFeatureStore(db, job.data.orgId);
    await enqueueStalePlaidSyncs();
  },
  onInsight: async (job) => {
    console.log(`Generate insights for org ${job.data.orgId}`);
    const { insights } = await import('@pf/database');
    const { getNetWorth, getCashFlowFromData } = await import('@pf/sync');
    const { generateInsight, createOpenAIClient } = await import('@pf/ai');

    const apiKey = process.env.OPENAI_API_KEY;
    const nw = await getNetWorth(db, job.data.orgId);
    const cf = await getCashFlowFromData(db, job.data.orgId);

    if (!apiKey || apiKey.includes('1234567890')) {
      await db.insert(insights).values({
        orgId: job.data.orgId,
        insightType: 'trend',
        title: 'Weekly Financial Check-in',
        body: `Net worth: $${nw.netWorth.toFixed(0)}. Savings rate: ${(cf.savingsRate * 100).toFixed(1)}%.`,
      });
      return;
    }

    const client = createOpenAIClient(apiKey);
    const result = await generateInsight(client, {
      netWorth: nw.netWorth,
      savingsRate: cf.savingsRate,
      recentChanges: ['Weekly automated review'],
    });

    await db.insert(insights).values({
      orgId: job.data.orgId,
      insightType: result.type as 'anomaly',
      title: result.title,
      body: result.body,
      aiModel: 'gpt-4o-mini',
    });
  },
  onNotification: async (job) => {
    console.log(`Notification job:`, job.data);
    await handleNotificationJob(db, job);
  },
});

async function scheduleDailyJobs() {
  const orgs = await db.select().from(organizations);
  for (const org of orgs) {
    await rollupQueue.add('rollup', { orgId: org.id }, { repeat: { pattern: '0 2 * * *' }, jobId: `rollup-${org.id}` });
    await insightsQueue.add('insights', { orgId: org.id }, { repeat: { pattern: '0 8 * * 1' }, jobId: `insights-${org.id}` });
    await notificationsQueue.add(
      'weekly-digest',
      { orgId: org.id, type: 'weekly_digest' },
      { repeat: { pattern: '0 9 * * 1' }, jobId: `digest-${org.id}` },
    );
  }
}

async function enqueueStalePlaidSyncs() {
  if (process.env.PLAID_SYNC_ENABLED === 'false') return;
  const items = await db.select().from(plaidItems);
  for (const item of items) {
    const stale = !item.lastSyncedAt || Date.now() - item.lastSyncedAt.getTime() > PLAID_STALE_MS;
    if (stale && !item.loginRequired) {
      await plaidSyncQueue.add(
        'sync',
        { itemId: item.id, orgId: item.orgId },
        { jobId: `proactive-${item.id}-${new Date().toISOString().slice(0, 13)}` },
      );
    }
  }
}

async function seedKnowledge() {
  const contentDir = resolve(process.cwd(), '../content/knowledge');
  const apiKey = process.env.OPENAI_API_KEY;
  const embedFn =
    apiKey && !apiKey.includes('1234567890')
      ? async (text: string) => generateEmbedding(createOpenAIClient(apiKey), text)
      : undefined;
  const result = await ingestKnowledgeBase(db, contentDir, embedFn);
  if (result.ingested > 0) console.log(`Ingested ${result.ingested} knowledge documents`);
}

scheduleDailyJobs().catch(console.error);
enqueueStalePlaidSyncs().catch(console.error);
seedKnowledge().catch(console.error);

console.log('Workers ready');
