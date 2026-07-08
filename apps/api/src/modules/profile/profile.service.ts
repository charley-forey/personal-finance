import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { financialProfiles } from '@pf/database';
import type { Database } from '@pf/database';
import type { FinancialProfile } from '@pf/shared';
import { DATABASE } from '../../database.module';

export interface UpsertFinancialProfileInput extends FinancialProfile {
  metadata?: Record<string, unknown>;
}

@Injectable()
export class ProfileService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async get(orgId: string, userId: string) {
    const [profile] = await this.db
      .select()
      .from(financialProfiles)
      .where(and(eq(financialProfiles.orgId, orgId), eq(financialProfiles.userId, userId)))
      .limit(1);
    return profile ?? null;
  }

  async upsert(orgId: string, userId: string, data: UpsertFinancialProfileInput) {
    const [existing] = await this.db
      .select()
      .from(financialProfiles)
      .where(and(eq(financialProfiles.orgId, orgId), eq(financialProfiles.userId, userId)))
      .limit(1);

    const values = {
      lifeStage: data.lifeStage,
      riskTolerance: data.riskTolerance,
      filingStatus: data.filingStatus,
      dependents: data.dependents,
      annualIncome: data.annualIncome?.toString(),
      stateCode: data.stateCode,
      goalsSummary: data.goalsSummary,
      metadataJson: data.metadata ?? {},
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await this.db
        .update(financialProfiles)
        .set(values)
        .where(eq(financialProfiles.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(financialProfiles)
      .values({ orgId, userId, ...values })
      .returning();
    return created;
  }

  async remove(orgId: string, userId: string) {
    const [deleted] = await this.db
      .delete(financialProfiles)
      .where(and(eq(financialProfiles.orgId, orgId), eq(financialProfiles.userId, userId)))
      .returning();
    if (!deleted) throw new NotFoundException('Financial profile not found');
    return deleted;
  }
}
