import { createWorkers, rollupQueue, insightsQueue } from './queues.js';
import { createDb } from '@pf/database';
import { organizations } from '@pf/database';

const db = createDb(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/personal_finance');

console.log('Starting Personal Finance OS workers...');

createWorkers({
  onPlaidSync: async (job) => {
    console.log(`Plaid sync job for item ${job.data.itemId}`);
    // Handled by API service — worker placeholder for scale-out
  },
  onRollup: async (job) => {
    console.log(`Daily rollup for org ${job.data.orgId}`);
  },
  onInsight: async (job) => {
    console.log(`Generate insights for org ${job.data.orgId}`);
  },
});

// Schedule daily rollup at 2am UTC
async function scheduleDailyJobs() {
  const orgs = await db.select().from(organizations);
  for (const org of orgs) {
    await rollupQueue.add('rollup', { orgId: org.id }, { repeat: { pattern: '0 2 * * *' } });
    await insightsQueue.add('insights', { orgId: org.id }, { repeat: { pattern: '0 8 * * 1' } });
  }
}

scheduleDailyJobs().catch(console.error);

console.log('Workers ready');
