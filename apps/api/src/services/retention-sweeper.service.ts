import { Injectable, Inject, Logger } from '@nestjs/common';
import { lt, and, isNotNull, eq } from 'drizzle-orm';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { plaidWebhookEvents, agentMemories, organizations } from '@pf/database';

const WEBHOOK_TTL_DAYS = Number(process.env.WEBHOOK_EVENT_TTL_DAYS ?? 30);

@Injectable()
export class RetentionSweeperService {
  private readonly log = new Logger(RetentionSweeperService.name);

  constructor(@Inject(DATABASE) private db: Database) {}

  async sweepOpsNoise() {
    const webhookCutoff = new Date(Date.now() - WEBHOOK_TTL_DAYS * 24 * 60 * 60 * 1000);
    const webhooks = await this.db
      .delete(plaidWebhookEvents)
      .where(lt(plaidWebhookEvents.createdAt, webhookCutoff))
      .returning({ id: plaidWebhookEvents.id });

    const now = new Date();
    const memories = await this.db
      .delete(agentMemories)
      .where(and(isNotNull(agentMemories.expiresAt), lt(agentMemories.expiresAt, now)))
      .returning({ id: agentMemories.id });

    this.log.log(`Retention sweep: webhooks=${webhooks.length} memories=${memories.length}`);
    return { webhooksRemoved: webhooks.length, memoriesRemoved: memories.length };
  }

  /** Hard-delete orgs past grace period. */
  async executeDueDeletions() {
    const due = await this.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(
        and(
          eq(organizations.status, 'pending_deletion'),
          isNotNull(organizations.deletionScheduledAt),
          lt(organizations.deletionScheduledAt, new Date()),
        ),
      );

    let purged = 0;
    for (const org of due) {
      await this.db.delete(organizations).where(eq(organizations.id, org.id));
      purged++;
    }
    this.log.log(`Executed ${purged} scheduled org deletions`);
    return { purged };
  }
}
