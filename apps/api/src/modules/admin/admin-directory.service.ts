import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, desc, sql, ilike, or, count, inArray } from 'drizzle-orm';
import {
  type Database,
  organizations,
  users,
  organizationMembers,
  userPreferences,
  subscriptions,
  plaidItems,
  accounts,
  agentConversations,
  agentRuns,
  documents,
  platformAdmins,
  adminAuditLogs,
  supportNotes,
  supportCases,
  entitlementOverrides,
  complimentaryGrants,
  auditLogs,
  userSignals,
} from '@pf/database';
import type {
  AuthContext,
  PlatformAdminContext,
  PlatformPermission,
  PlatformRole,
  PlanTier,
} from '@pf/shared';
import { DATABASE } from '../../database.module';
import { buildPlatformAdminContext } from '../../common/platform-admin.guard';
import { BillingService } from '../../services/billing.service';

const TOKEN_COST_PER_1K = 0.002; // rough USD estimate

@Injectable()
export class AdminRbacService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async resolveContext(auth: AuthContext): Promise<PlatformAdminContext> {
    const email = auth.email.toLowerCase();
    const [row] = await this.db
      .select()
      .from(platformAdmins)
      .where(eq(platformAdmins.email, email))
      .limit(1);

    const ctx = buildPlatformAdminContext({
      email,
      userId: auth.userId,
      dbRole: (row?.role as PlatformRole | undefined) ?? null,
      dbActive: row?.active,
    });

    // Link userId if missing on seed row; auto-activate env allowlist into DB
    if (ctx.isPlatformAdmin && auth.userId && !auth.userId.startsWith('api-key:')) {
      if (row && !row.userId) {
        await this.db
          .update(platformAdmins)
          .set({ userId: auth.userId, updatedAt: new Date() })
          .where(eq(platformAdmins.id, row.id));
      } else if (!row && ctx.viaBreakGlass) {
        await this.db
          .insert(platformAdmins)
          .values({
            email,
            userId: auth.userId,
            role: 'platform_owner',
            active: true,
          })
          .onConflictDoUpdate({
            target: platformAdmins.email,
            set: { userId: auth.userId, role: 'platform_owner', active: true, updatedAt: new Date() },
          });
      }
    }

    return ctx;
  }

  async listAdmins() {
    return this.db.select().from(platformAdmins).orderBy(desc(platformAdmins.createdAt));
  }

  async upsertAdmin(email: string, role: PlatformRole, actor: PlatformAdminContext) {
    const normalized = email.toLowerCase().trim();
    const [existing] = await this.db
      .select()
      .from(platformAdmins)
      .where(eq(platformAdmins.email, normalized))
      .limit(1);

    let result;
    if (existing) {
      [result] = await this.db
        .update(platformAdmins)
        .set({ role, active: true, updatedAt: new Date() })
        .where(eq(platformAdmins.id, existing.id))
        .returning();
    } else {
      [result] = await this.db
        .insert(platformAdmins)
        .values({ email: normalized, role, active: true })
        .returning();
    }

    await this.writeAudit({
      actor,
      permission: 'admins:manage',
      action: existing ? 'platform_admin.update' : 'platform_admin.create',
      entityType: 'platform_admin',
      entityId: result.id,
      before: existing ?? undefined,
      after: result,
      reason: `Set role ${role}`,
    });

    return result;
  }

  async deactivateAdmin(id: string, actor: PlatformAdminContext) {
    const [before] = await this.db.select().from(platformAdmins).where(eq(platformAdmins.id, id)).limit(1);
    if (!before) throw new NotFoundException('Platform admin not found');
    const [after] = await this.db
      .update(platformAdmins)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(platformAdmins.id, id))
      .returning();
    await this.writeAudit({
      actor,
      permission: 'admins:manage',
      action: 'platform_admin.deactivate',
      entityType: 'platform_admin',
      entityId: id,
      before,
      after,
    });
    return after;
  }

  async writeAudit(input: {
    actor: PlatformAdminContext;
    permission?: PlatformPermission;
    action: string;
    entityType?: string;
    entityId?: string;
    targetOrgId?: string;
    reason?: string;
    before?: unknown;
    after?: unknown;
    metadata?: Record<string, unknown>;
    ip?: string;
    requestId?: string;
  }) {
    const [row] = await this.db
      .insert(adminAuditLogs)
      .values({
        actorUserId: input.actor.userId.startsWith('api-key:') ? null : input.actor.userId,
        actorEmail: input.actor.email,
        permission: input.permission,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        targetOrgId: input.targetOrgId,
        reason: input.reason,
        beforeJson: (input.before as Record<string, unknown>) ?? undefined,
        afterJson: (input.after as Record<string, unknown>) ?? undefined,
        metadataJson: input.metadata,
        ip: input.ip,
        requestId: input.requestId,
      })
      .returning();
    return row;
  }

  async listAdminAudit(opts: { q?: string; limit?: number; orgId?: string }) {
    const limit = Math.min(opts.limit ?? 100, 500);
    let rows = await this.db
      .select()
      .from(adminAuditLogs)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit);

    if (opts.orgId) {
      rows = rows.filter((r) => r.targetOrgId === opts.orgId);
    }
    if (opts.q) {
      const q = opts.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.action.toLowerCase().includes(q) ||
          r.actorEmail.toLowerCase().includes(q) ||
          (r.entityId ?? '').toLowerCase().includes(q),
      );
    }
    return { results: rows, total: rows.length };
  }
}

@Injectable()
export class AdminDirectoryService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private billing: BillingService,
    private rbac: AdminRbacService,
  ) {}

  async searchOrgs(opts: { q?: string; page?: number; pageSize?: number; status?: string; plan?: string }) {
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 25));
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (opts.q?.trim()) {
      conditions.push(
        or(
          ilike(organizations.name, `%${opts.q.trim()}%`),
          ilike(organizations.stripeCustomerId, `%${opts.q.trim()}%`),
          sql`${organizations.id}::text ilike ${`%${opts.q.trim()}%`}`,
        ),
      );
    }
    if (opts.status) conditions.push(eq(organizations.status, opts.status as 'active' | 'suspended' | 'pending_deletion'));
    if (opts.plan) conditions.push(eq(organizations.planTier, opts.plan as PlanTier));

    const where = conditions.length ? and(...conditions) : undefined;

    const [totalRow] = await this.db
      .select({ total: count() })
      .from(organizations)
      .where(where);

    const orgs = await this.db
      .select()
      .from(organizations)
      .where(where)
      .orderBy(desc(organizations.createdAt))
      .limit(pageSize)
      .offset(offset);

    const orgIds = orgs.map((o) => o.id);
    const memberCounts =
      orgIds.length === 0
        ? []
        : await this.db
            .select({
              orgId: organizationMembers.orgId,
              memberCount: count(),
            })
            .from(organizationMembers)
            .where(inArray(organizationMembers.orgId, orgIds))
            .groupBy(organizationMembers.orgId);

    const countMap = new Map(memberCounts.map((m) => [m.orgId, Number(m.memberCount)]));

    return {
      data: orgs.map((o) => ({
        ...o,
        memberCount: countMap.get(o.id) ?? 0,
      })),
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
      hasMore: offset + orgs.length < Number(totalRow?.total ?? 0),
    };
  }

  async getOrg(orgId: string) {
    const [org] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!org) throw new NotFoundException('Organization not found');

    const members = await this.db
      .select({
        userId: users.id,
        email: users.email,
        name: users.name,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(users.id, organizationMembers.userId))
      .where(eq(organizationMembers.orgId, orgId));

    const [sub] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.orgId, orgId))
      .limit(1);

    const usage = await this.billing.getPlanSummary(orgId);

    const items = await this.db
      .select({
        id: plaidItems.id,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        loginRequired: plaidItems.loginRequired,
        errorCode: plaidItems.errorCode,
        lastSyncedAt: plaidItems.lastSyncedAt,
        consentExpiresAt: plaidItems.consentExpiresAt,
        createdAt: plaidItems.createdAt,
      })
      .from(plaidItems)
      .where(eq(plaidItems.orgId, orgId));

    const [acctCount] = await this.db
      .select({ total: count() })
      .from(accounts)
      .where(eq(accounts.orgId, orgId));

    const [docCount] = await this.db
      .select({ total: count() })
      .from(documents)
      .where(eq(documents.orgId, orgId));

    const aiAgg = await this.db
      .select({
        runs: count(),
        tokens: sql<number>`coalesce(sum(${agentRuns.tokensUsed}), 0)`,
        avgLatency: sql<number>`coalesce(avg(${agentRuns.latencyMs}), 0)`,
      })
      .from(agentRuns)
      .innerJoin(agentConversations, eq(agentConversations.id, agentRuns.conversationId))
      .where(eq(agentConversations.orgId, orgId));

    const notes = await this.db
      .select()
      .from(supportNotes)
      .where(eq(supportNotes.orgId, orgId))
      .orderBy(desc(supportNotes.createdAt))
      .limit(20);

    const cases = await this.db
      .select()
      .from(supportCases)
      .where(eq(supportCases.orgId, orgId))
      .orderBy(desc(supportCases.updatedAt))
      .limit(20);

    const overrides = await this.db
      .select()
      .from(entitlementOverrides)
      .where(eq(entitlementOverrides.orgId, orgId))
      .orderBy(desc(entitlementOverrides.createdAt));

    const comps = await this.db
      .select()
      .from(complimentaryGrants)
      .where(eq(complimentaryGrants.orgId, orgId))
      .orderBy(desc(complimentaryGrants.createdAt));

    const tokens = Number(aiAgg[0]?.tokens ?? 0);

    return {
      org,
      members,
      subscription: sub ?? null,
      usage,
      plaidItems: items,
      accountCount: Number(acctCount?.total ?? 0),
      documentCount: Number(docCount?.total ?? 0),
      ai: {
        runs: Number(aiAgg[0]?.runs ?? 0),
        tokens,
        avgLatencyMs: Math.round(Number(aiAgg[0]?.avgLatency ?? 0)),
        estimatedCostUsd: Number(((tokens / 1000) * TOKEN_COST_PER_1K).toFixed(4)),
      },
      supportNotes: notes,
      supportCases: cases,
      entitlementOverrides: overrides,
      complimentaryGrants: comps,
    };
  }

  async searchUsers(opts: { q?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 25));
    const offset = (page - 1) * pageSize;

    const where = opts.q?.trim()
      ? or(ilike(users.email, `%${opts.q.trim()}%`), ilike(users.name, `%${opts.q.trim()}%`))
      : undefined;

    const [totalRow] = await this.db.select({ total: count() }).from(users).where(where);
    const rows = await this.db
      .select()
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      data: rows,
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
      hasMore: offset + rows.length < Number(totalRow?.total ?? 0),
    };
  }

  async getUser(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new NotFoundException('User not found');

    const memberships = await this.db
      .select({
        orgId: organizations.id,
        orgName: organizations.name,
        planTier: organizations.planTier,
        status: organizations.status,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizations.id, organizationMembers.orgId))
      .where(eq(organizationMembers.userId, userId));

    const [prefs] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return {
      user,
      memberships,
      preferences: prefs ?? null,
      onboardingCompleted: Boolean(
        (prefs?.notificationSettingsJson as Record<string, unknown> | undefined)?.onboardingCompleted,
      ),
    };
  }

  async universalSearch(q: string) {
    const query = q.trim();
    if (!query) return { orgs: [], users: [], subscriptions: [], plaidItems: [] };

    const orgs = await this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        planTier: organizations.planTier,
        status: organizations.status,
      })
      .from(organizations)
      .where(
        or(
          ilike(organizations.name, `%${query}%`),
          ilike(organizations.stripeCustomerId, `%${query}%`),
          sql`${organizations.id}::text ilike ${`%${query}%`}`,
        ),
      )
      .limit(10);

    const userRows = await this.db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(or(ilike(users.email, `%${query}%`), ilike(users.name, `%${query}%`)))
      .limit(10);

    const subs = await this.db
      .select({
        id: subscriptions.id,
        orgId: subscriptions.orgId,
        stripeSubscriptionId: subscriptions.stripeSubscriptionId,
        stripeCustomerId: subscriptions.stripeCustomerId,
        status: subscriptions.status,
        planTier: subscriptions.planTier,
      })
      .from(subscriptions)
      .where(
        or(
          ilike(subscriptions.stripeSubscriptionId, `%${query}%`),
          ilike(subscriptions.stripeCustomerId, `%${query}%`),
        ),
      )
      .limit(10);

    const items = await this.db
      .select({
        id: plaidItems.id,
        orgId: plaidItems.orgId,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        loginRequired: plaidItems.loginRequired,
      })
      .from(plaidItems)
      .where(
        or(
          ilike(plaidItems.institutionName, `%${query}%`),
          ilike(plaidItems.plaidItemId, `%${query}%`),
          sql`${plaidItems.id}::text ilike ${`%${query}%`}`,
        ),
      )
      .limit(10);

    return { orgs, users: userRows, subscriptions: subs, plaidItems: items };
  }

  async orgTimeline(orgId: string, limit = 50) {
    const [adminActs, audits, signals, cases] = await Promise.all([
      this.db
        .select()
        .from(adminAuditLogs)
        .where(eq(adminAuditLogs.targetOrgId, orgId))
        .orderBy(desc(adminAuditLogs.createdAt))
        .limit(limit),
      this.db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.orgId, orgId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit),
      this.db
        .select()
        .from(userSignals)
        .where(eq(userSignals.orgId, orgId))
        .orderBy(desc(userSignals.occurredAt))
        .limit(limit),
      this.db
        .select()
        .from(supportCases)
        .where(eq(supportCases.orgId, orgId))
        .orderBy(desc(supportCases.updatedAt))
        .limit(20),
    ]);

    const events = [
      ...adminActs.map((a) => ({
        type: 'admin_audit' as const,
        at: a.createdAt,
        summary: a.action,
        meta: { actor: a.actorEmail, reason: a.reason },
      })),
      ...audits.map((a) => ({
        type: 'audit' as const,
        at: a.createdAt,
        summary: a.action,
        meta: { entityType: a.entityType, entityId: a.entityId },
      })),
      ...signals.map((s) => ({
        type: 'signal' as const,
        at: s.occurredAt,
        summary: s.signalType,
        meta: { entityType: s.entityType, entityId: s.entityId },
      })),
      ...cases.map((c) => ({
        type: 'support_case' as const,
        at: c.updatedAt,
        summary: `${c.status}: ${c.subject}`,
        meta: { id: c.id, priority: c.priority },
      })),
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, limit);

    return { orgId, events };
  }
}
