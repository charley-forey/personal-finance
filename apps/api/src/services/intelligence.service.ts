import { Injectable, Inject } from '@nestjs/common';
import { eq, desc, and, isNull } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  insightFeedback,
  recommendationItems,
  recommendationOutcomes,
  userSignals,
  insights,
} from '@pf/database';
import { rankRecommendations } from '@pf/intelligence';
import { DATABASE } from '../database.module';

@Injectable()
export class IntelligenceService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async recordInsightFeedback(
    orgId: string,
    userId: string,
    input: { insightId: string; helpful?: boolean; actedOn?: boolean; dismissed?: boolean; reason?: string },
  ) {
    const [row] = await this.db
      .insert(insightFeedback)
      .values({
        orgId,
        userId,
        insightId: input.insightId,
        helpful: input.helpful,
        actedOn: input.actedOn,
        dismissed: input.dismissed,
        reason: input.reason,
      })
      .returning();

    if (input.dismissed) {
      await this.db
        .update(insights)
        .set({ dismissedAt: new Date() })
        .where(and(eq(insights.id, input.insightId), eq(insights.orgId, orgId)));
    }

    return row;
  }

  async recordUserSignal(
    orgId: string,
    userId: string,
    input: { signalType: string; entityType?: string; entityId?: string; payload?: Record<string, unknown> },
  ) {
    const [row] = await this.db
      .insert(userSignals)
      .values({
        orgId,
        userId,
        signalType: input.signalType,
        entityType: input.entityType,
        entityId: input.entityId,
        payloadJson: input.payload ?? {},
      })
      .returning();
    return row;
  }

  async listRecommendations(orgId: string, limit = 10) {
    return this.db
      .select()
      .from(recommendationItems)
      .where(and(eq(recommendationItems.orgId, orgId), eq(recommendationItems.status, 'pending')))
      .orderBy(desc(recommendationItems.priorityScore))
      .limit(limit);
  }

  async generateRecommendations(orgId: string, userId?: string) {
    const recentInsights = await this.db
      .select()
      .from(insights)
      .where(and(eq(insights.orgId, orgId), isNull(insights.dismissedAt)))
      .orderBy(desc(insights.generatedAt))
      .limit(5);

    const ranked = rankRecommendations(
      recentInsights.map((insight) => ({
        title: insight.title,
        body: insight.body,
        actionType: insight.insightType,
        relevance: 0.8,
        urgency: insight.insightType === 'warning' ? 0.9 : 0.6,
        confidence: 0.75,
      })),
    );

    const inserted = [];
    for (const item of ranked.slice(0, 5)) {
      const [row] = await this.db
        .insert(recommendationItems)
        .values({
          orgId,
          userId,
          title: item.title,
          body: item.body,
          actionType: item.actionType,
          priorityScore: String(item.priorityScore ?? 0),
          confidence: String(item.confidence ?? 0),
          status: 'pending',
        })
        .returning();
      inserted.push(row);
    }

    return inserted;
  }

  async completeRecommendation(orgId: string, id: string, outcome: string, notes?: string) {
    await this.db
      .update(recommendationItems)
      .set({ status: outcome === 'completed' ? 'completed' : 'dismissed' })
      .where(and(eq(recommendationItems.id, id), eq(recommendationItems.orgId, orgId)));

    const [row] = await this.db
      .insert(recommendationOutcomes)
      .values({ orgId, recommendationId: id, outcome, notes })
      .returning();

    return row;
  }
}
