import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { categories, categoryGroups, categoryRules } from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { seedDefaultCategories, categorizeOrgTransactions, getInboxItems } from '@pf/sync';

@Injectable()
export class CategoryService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async ensureSeeded(orgId: string) {
    await seedDefaultCategories(this.db, orgId);
  }

  async listGroups(orgId: string) {
    await this.ensureSeeded(orgId);
    const groups = await this.db.select().from(categoryGroups).where(eq(categoryGroups.orgId, orgId));
    const cats = await this.db.select().from(categories).where(eq(categories.orgId, orgId));
    return groups.map((g) => ({
      ...g,
      categories: cats.filter((c) => c.groupId === g.id),
    }));
  }

  async list(orgId: string) {
    await this.ensureSeeded(orgId);
    return this.db.select().from(categories).where(eq(categories.orgId, orgId));
  }

  async create(orgId: string, data: { name: string; groupId?: string; pnlRowKey?: string }) {
    const [cat] = await this.db
      .insert(categories)
      .values({ orgId, name: data.name, groupId: data.groupId, pnlRowKey: data.pnlRowKey })
      .returning();
    return cat;
  }

  async createRule(orgId: string, data: { matchType: string; pattern: string; categoryId: string; priority?: number }) {
    const [rule] = await this.db
      .insert(categoryRules)
      .values({
        orgId,
        matchType: data.matchType,
        pattern: data.pattern,
        categoryId: data.categoryId,
        priority: data.priority ?? 0,
      })
      .returning();
    return rule;
  }

  async recategorizeAll(orgId: string) {
    return categorizeOrgTransactions(this.db, orgId);
  }

  async getInbox(orgId: string) {
    return getInboxItems(this.db, orgId);
  }
}
