import { Injectable, Inject } from '@nestjs/common';
import { eq, desc, and, isNull, sql } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  insightFeedback,
  recommendationItems,
  recommendationOutcomes,
  userSignals,
  insights,
  financialProfiles,
  transactions,
  domainEvents,
} from '@pf/database';
import { EVENT_TYPES } from '@pf/events';
import { detectSpendingAnomalies, rankRecommendations, scorePersonalization } from '@pf/intelligence';
import { DATABASE } from '../database.module';

@Injectable()
export class IntelligenceService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async getFinancialProfile(orgId: string, userId?: string) {
    const conditions = userId
      ? and(eq(financialProfiles.orgId, orgId), eq(financialProfiles.userId, userId))
      : eq(financialProfiles.orgId, orgId);

    const [profile] = await this.db.select().from(financialProfiles).where(conditions).limit(1);
    return profile ?? null;
  }

  async detectAndStoreAnomalies(orgId: string) {
    const txns = await this.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.orgId, orgId), eq(transactions.isDeleted, false)))
      .orderBy(desc(transactions.date))
      .limit(500);

    const anomalies = detectSpendingAnomalies(
      txns.map((txn) => ({
        id: txn.id,
        amount: txn.amount,
        date: txn.date,
        categoryId: txn.categoryId,
        merchantName: txn.merchantName,
        name: txn.name,
      })),
    );

    const inserted = [];
    for (const anomaly of anomalies) {
      const label = anomaly.merchantName ?? anomaly.name ?? 'Transaction';
      const [row] = await this.db
        .insert(insights)
        .values({
          orgId,
          insightType: 'anomaly',
          severity: anomaly.zScore >= 3.5 ? 'warning' : 'info',
          title: `Unusual spending: ${label}`,
          body: `A $${anomaly.amount.toFixed(2)} charge is ${anomaly.zScore.toFixed(1)} standard deviations above your typical spending in this category.`,
          dataJson: {
            transactionId: anomaly.transactionId,
            zScore: anomaly.zScore,
            amount: anomaly.amount,
            date: anomaly.date,
          },
        })
        .returning();
      inserted.push(row);
    }

    return inserted;
  }

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

    await this.db.insert(domainEvents).values({
      orgId,
      eventType: EVENT_TYPES.INSIGHT_FEEDBACK,
      aggregateType: 'insight',
      aggregateId: input.insightId,
      payloadJson: {
        feedbackId: row.id,
        insightId: input.insightId,
        helpful: input.helpful,
        actedOn: input.actedOn,
        dismissed: input.dismissed,
        reason: input.reason,
        userId,
      },
      metadataJson: { userId, source: 'intelligence.service' },
    });

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
    const [recentInsights, profile, signalStats, outcomeStats] = await Promise.all([
      this.db
        .select()
        .from(insights)
        .where(and(eq(insights.orgId, orgId), isNull(insights.dismissedAt)))
        .orderBy(desc(insights.generatedAt))
        .limit(5),
      userId ? this.getFinancialProfile(orgId, userId) : this.getFinancialProfile(orgId),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(userSignals)
        .where(
          userId
            ? and(eq(userSignals.orgId, orgId), eq(userSignals.userId, userId))
            : eq(userSignals.orgId, orgId),
        ),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(recommendationOutcomes)
        .where(and(eq(recommendationOutcomes.orgId, orgId), eq(recommendationOutcomes.outcome, 'completed'))),
    ]);

    const personalizationScore = scorePersonalization(profile, {
      recentSignalCount: signalStats[0]?.count ?? 0,
      acceptedRecommendationCount: outcomeStats[0]?.count ?? 0,
      preferredActionTypes: profile?.metadataJson?.preferredActionTypes as string[] | undefined,
    });

    const profileBoost = personalizationScore * 0.15;

    const ranked = rankRecommendations(
      recentInsights.map((insight) => ({
        title: insight.title,
        body: insight.body,
        actionType: insight.insightType,
        relevance: 0.7 + profileBoost,
        urgency: insight.insightType === 'warning' ? 0.9 : 0.6,
        confidence: 0.65 + profileBoost,
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
          metadataJson: { personalizationScore },
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
