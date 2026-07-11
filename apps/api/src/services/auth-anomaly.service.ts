/**
 * Auth anomaly → Action Queue signals.
 * Call from AuthGuard / login path when new device or burst 401s detected.
 */
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { recommendationItems, auditLogs } from '@pf/database';

@Injectable()
export class AuthAnomalyService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async recordLoginAnomaly(orgId: string, userId: string, reason: string, metadata: Record<string, unknown> = {}) {
    await this.db.insert(auditLogs).values({
      orgId,
      userId,
      action: 'auth.anomaly',
      entityType: 'user',
      entityId: userId,
      metadataJson: { reason, ...metadata },
    });

    await this.db.insert(recommendationItems).values({
      orgId,
      title: 'Review recent sign-in activity',
      body: reason,
      actionType: 'security_review',
      status: 'pending',
      priorityScore: '80',
      confidence: '0.7',
    });
  }

  async listOpenSecurityRecommendations(orgId: string) {
    return this.db
      .select()
      .from(recommendationItems)
      .where(eq(recommendationItems.orgId, orgId));
  }
}
