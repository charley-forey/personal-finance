import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { journeyProgress } from '@pf/database';
import { JOURNEY_HUBS, getJourneyHub } from '@pf/context';
import { DATABASE } from '../database.module';

@Injectable()
export class JourneyService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async getProgress(orgId: string, userId?: string) {
    const rows = await this.db
      .select()
      .from(journeyProgress)
      .where(
        userId
          ? and(eq(journeyProgress.orgId, orgId), eq(journeyProgress.userId, userId))
          : eq(journeyProgress.orgId, orgId),
      );

    const completed = new Set(rows.filter((r) => r.completed).map((r) => `${r.hubId}:${r.stepId}`));

    return JOURNEY_HUBS.map((hub) => ({
      hubId: hub.id,
      label: hub.label,
      route: hub.route,
      steps: hub.steps.map((step) => ({
        ...step,
        completed: completed.has(`${hub.id}:${step.id}`),
      })),
      completedCount: hub.steps.filter((s) => completed.has(`${hub.id}:${s.id}`)).length,
      totalCount: hub.steps.length,
    }));
  }

  async completeStep(orgId: string, hubId: string, stepId: string, userId?: string) {
    const hub = getJourneyHub(hubId);
    if (!hub) throw new Error('Unknown hub');
    if (!hub.steps.some((s) => s.id === stepId)) throw new Error('Unknown step');

    const conditions = userId
      ? and(
          eq(journeyProgress.orgId, orgId),
          eq(journeyProgress.userId, userId),
          eq(journeyProgress.hubId, hubId),
          eq(journeyProgress.stepId, stepId),
        )
      : and(eq(journeyProgress.orgId, orgId), eq(journeyProgress.hubId, hubId), eq(journeyProgress.stepId, stepId));

    const [existing] = await this.db.select().from(journeyProgress).where(conditions).limit(1);

    if (existing) {
      const [row] = await this.db
        .update(journeyProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(journeyProgress.id, existing.id))
        .returning();
      return row;
    }

    const [row] = await this.db
      .insert(journeyProgress)
      .values({
        orgId,
        userId: userId ?? null,
        hubId,
        stepId,
        completed: true,
        completedAt: new Date(),
      })
      .returning();

    return row;
  }
}
