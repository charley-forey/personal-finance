import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, desc, sql, gte, count, inArray, or } from 'drizzle-orm';
import {
  type Database,
  organizations,
  users,
  subscriptions,
  plaidItems,
  agentConversations,
  agentRuns,
  insights,
  insightFeedback,
  userSignals,
  featureFlags,
  platformAlerts,
  entitlementOverrides,
  complimentaryGrants,
  platformMetricSnapshots,
  plaidWebhookEvents,
  organizationMembers,
  userPreferences,
} from '@pf/database';
import type { PlatformAdminContext, PlanTier } from '@pf/shared';
import { DATABASE } from '../../database.module';
import { AdminRbacService } from './admin-directory.service';
import { BillingService } from '../../services/billing.service';

const TOKEN_COST_PER_1K = 0.002;

const KILL_SWITCHES = [
  { key: 'AI_ENABLED', label: 'AI / LLM', description: 'Disable agent chat, embeddings, document extraction' },
  { key: 'PLAID_SYNC_ENABLED', label: 'Plaid sync', description: 'Skip enqueueing / processing Plaid sync jobs' },
  { key: 'INTELLIGENCE_JOBS_ENABLED', label: 'Intelligence jobs', description: 'Skip learning-loop workers' },
  { key: 'EVENT_PIPELINE_ENABLED', label: 'Event pipeline', description: 'Skip domain-event processing' },
  { key: 'SSE_ENABLED', label: 'SSE stream', description: 'Disable /events/stream' },
  { key: 'ADVISOR_PORTAL_ENABLED', label: 'Advisor portal', description: 'Force advisor routes to stub' },
] as const;

const PLAYBOOKS = [
  {
    key: 'bank_reconnect',
    title: 'Bank reconnect',
    steps: ['Open org Plaid health', 'Confirm login_required', 'Ask user to re-link', 'Force sync after reconnect'],
  },
  {
    key: 'billing_dispute',
    title: 'Billing dispute',
    steps: ['Open FinOps subscription', 'Check Stripe deep-link', 'Review comps/overrides', 'Apply plan or refund via Stripe'],
  },
  {
    key: 'ai_cost_spike',
    title: 'AI cost spike',
    steps: ['Open AI metrics for org', 'Check agent run volume', 'Apply entitlement override or flag off', 'Notify eng_ops'],
  },
  {
    key: 'gdpr_delete',
    title: 'GDPR delete',
    steps: ['Create DSAR delete request', 'Export data first', 'Dual-control approve', 'Execute delete and audit'],
  },
] as const;

@Injectable()
export class AdminMetricsService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async overview() {
    const since7 = new Date(Date.now() - 7 * 86400000);
    const since30 = new Date(Date.now() - 30 * 86400000);

    const [
      orgTotal,
      userTotal,
      planMix,
      orgs7,
      orgs30,
      users7,
      plaidHealth,
      ai30,
      paidSubs,
      pastDue,
      openAlerts,
    ] = await Promise.all([
      this.db.select({ total: count() }).from(organizations),
      this.db.select({ total: count() }).from(users),
      this.db
        .select({ planTier: organizations.planTier, total: count() })
        .from(organizations)
        .groupBy(organizations.planTier),
      this.db.select({ total: count() }).from(organizations).where(gte(organizations.createdAt, since7)),
      this.db.select({ total: count() }).from(organizations).where(gte(organizations.createdAt, since30)),
      this.db.select({ total: count() }).from(users).where(gte(users.createdAt, since7)),
      this.db
        .select({
          total: count(),
          loginRequired: sql<number>`coalesce(sum(case when ${plaidItems.loginRequired} then 1 else 0 end), 0)`,
          errors: sql<number>`coalesce(sum(case when ${plaidItems.syncStatus} = 'error' then 1 else 0 end), 0)`,
        })
        .from(plaidItems),
      this.db
        .select({
          runs: count(),
          tokens: sql<number>`coalesce(sum(${agentRuns.tokensUsed}), 0)`,
          avgLatency: sql<number>`coalesce(avg(${agentRuns.latencyMs}), 0)`,
        })
        .from(agentRuns)
        .where(gte(agentRuns.createdAt, since30)),
      this.db
        .select({ total: count() })
        .from(subscriptions)
        .where(inArray(subscriptions.status, ['active', 'trialing'])),
      this.db.select({ total: count() }).from(subscriptions).where(eq(subscriptions.status, 'past_due')),
      this.db.select({ total: count() }).from(platformAlerts).where(eq(platformAlerts.status, 'open')),
    ]);

    const tokens = Number(ai30[0]?.tokens ?? 0);
    const linkedOrgs = await this.db
      .select({ total: sql<number>`count(distinct ${plaidItems.orgId})` })
      .from(plaidItems);

    return {
      orgs: Number(orgTotal[0]?.total ?? 0),
      users: Number(userTotal[0]?.total ?? 0),
      signups7d: Number(orgs7[0]?.total ?? 0),
      signups30d: Number(orgs30[0]?.total ?? 0),
      users7d: Number(users7[0]?.total ?? 0),
      planMix: planMix.map((p) => ({ plan: p.planTier, count: Number(p.total) })),
      paidSubscriptions: Number(paidSubs[0]?.total ?? 0),
      pastDue: Number(pastDue[0]?.total ?? 0),
      linkedBankOrgs: Number(linkedOrgs[0]?.total ?? 0),
      plaid: {
        items: Number(plaidHealth[0]?.total ?? 0),
        loginRequired: Number(plaidHealth[0]?.loginRequired ?? 0),
        errors: Number(plaidHealth[0]?.errors ?? 0),
      },
      ai30d: {
        runs: Number(ai30[0]?.runs ?? 0),
        tokens,
        avgLatencyMs: Math.round(Number(ai30[0]?.avgLatency ?? 0)),
        estimatedCostUsd: Number(((tokens / 1000) * TOKEN_COST_PER_1K).toFixed(2)),
      },
      openAlerts: Number(openAlerts[0]?.total ?? 0),
      environment: process.env.NODE_ENV ?? 'development',
      generatedAt: new Date().toISOString(),
    };
  }

  async funnel() {
    const signalCounts = await this.db
      .select({ signalType: userSignals.signalType, total: count() })
      .from(userSignals)
      .groupBy(userSignals.signalType)
      .orderBy(desc(count()));

    const prefs = await this.db.select({ settings: userPreferences.notificationSettingsJson }).from(userPreferences);
    const onboardingDone = prefs.filter(
      (p) => Boolean((p.settings as Record<string, unknown> | null)?.onboardingCompleted),
    ).length;

    const [orgsWithBank] = await this.db
      .select({ total: sql<number>`count(distinct ${plaidItems.orgId})` })
      .from(plaidItems);

    const [orgTotal] = await this.db.select({ total: count() }).from(organizations);

    return {
      signals: signalCounts.map((s) => ({ type: s.signalType, count: Number(s.total) })),
      onboardingCompletedUsers: onboardingDone,
      preferenceUsers: prefs.length,
      orgsWithBankLink: Number(orgsWithBank?.total ?? 0),
      totalOrgs: Number(orgTotal?.total ?? 0),
      activationRate:
        Number(orgTotal?.total ?? 0) > 0
          ? Number(((Number(orgsWithBank?.total ?? 0) / Number(orgTotal?.total ?? 1)) * 100).toFixed(1))
          : 0,
    };
  }

  async aiMetrics() {
    const since30 = new Date(Date.now() - 30 * 86400000);
    const byOrg = await this.db
      .select({
        orgId: agentConversations.orgId,
        runs: count(),
        tokens: sql<number>`coalesce(sum(${agentRuns.tokensUsed}), 0)`,
        avgLatency: sql<number>`coalesce(avg(${agentRuns.latencyMs}), 0)`,
      })
      .from(agentRuns)
      .innerJoin(agentConversations, eq(agentConversations.id, agentRuns.conversationId))
      .where(gte(agentRuns.createdAt, since30))
      .groupBy(agentConversations.orgId)
      .orderBy(desc(sql`coalesce(sum(${agentRuns.tokensUsed}), 0)`))
      .limit(50);

    const orgIds = byOrg.map((r) => r.orgId);
    const orgNames =
      orgIds.length === 0
        ? []
        : await this.db
            .select({ id: organizations.id, name: organizations.name })
            .from(organizations)
            .where(inArray(organizations.id, orgIds));
    const nameMap = new Map(orgNames.map((o) => [o.id, o.name]));

    return {
      topOrgs: byOrg.map((r) => {
        const tokens = Number(r.tokens);
        return {
          orgId: r.orgId,
          orgName: nameMap.get(r.orgId) ?? r.orgId,
          runs: Number(r.runs),
          tokens,
          avgLatencyMs: Math.round(Number(r.avgLatency)),
          estimatedCostUsd: Number(((tokens / 1000) * TOKEN_COST_PER_1K).toFixed(4)),
        };
      }),
    };
  }

  async plaidHealth() {
    const items = await this.db
      .select({
        id: plaidItems.id,
        orgId: plaidItems.orgId,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        loginRequired: plaidItems.loginRequired,
        errorCode: plaidItems.errorCode,
        lastSyncedAt: plaidItems.lastSyncedAt,
        consentExpiresAt: plaidItems.consentExpiresAt,
      })
      .from(plaidItems)
      .where(or(eq(plaidItems.loginRequired, true), eq(plaidItems.syncStatus, 'error')))
      .orderBy(desc(plaidItems.lastSyncedAt))
      .limit(100);

    const webhookBacklog = await this.db
      .select({ total: count() })
      .from(plaidWebhookEvents)
      .where(eq(plaidWebhookEvents.status, 'pending'));

    return {
      brokenItems: items,
      pendingWebhooks: Number(webhookBacklog[0]?.total ?? 0),
    };
  }

  async insightsSummary() {
    const [insightCount] = await this.db.select({ total: count() }).from(insights);
    const feedback = await this.db
      .select({
        helpful: sql<number>`coalesce(sum(case when ${insightFeedback.helpful} then 1 else 0 end), 0)`,
        dismissed: sql<number>`coalesce(sum(case when ${insightFeedback.dismissed} then 1 else 0 end), 0)`,
        actedOn: sql<number>`coalesce(sum(case when ${insightFeedback.actedOn} then 1 else 0 end), 0)`,
        total: count(),
      })
      .from(insightFeedback);

    const totalFb = Number(feedback[0]?.total ?? 0);
    return {
      insights: Number(insightCount?.total ?? 0),
      feedback: {
        total: totalFb,
        helpful: Number(feedback[0]?.helpful ?? 0),
        dismissed: Number(feedback[0]?.dismissed ?? 0),
        actedOn: Number(feedback[0]?.actedOn ?? 0),
        helpfulRate: totalFb ? Number(((Number(feedback[0]?.helpful ?? 0) / totalFb) * 100).toFixed(1)) : 0,
      },
    };
  }

  async listAlerts() {
    return this.db
      .select()
      .from(platformAlerts)
      .orderBy(desc(platformAlerts.createdAt))
      .limit(100);
  }

  async acknowledgeAlert(id: string, actor: PlatformAdminContext, rbac: AdminRbacService) {
    const [before] = await this.db.select().from(platformAlerts).where(eq(platformAlerts.id, id)).limit(1);
    if (!before) throw new NotFoundException('Alert not found');
    const [after] = await this.db
      .update(platformAlerts)
      .set({ status: 'acknowledged', acknowledgedAt: new Date() })
      .where(eq(platformAlerts.id, id))
      .returning();
    await rbac.writeAudit({
      actor,
      permission: 'metrics:read',
      action: 'alert.acknowledge',
      entityType: 'platform_alert',
      entityId: id,
      before,
      after,
    });
    return after;
  }

  async ensureThresholdAlerts() {
    const overview = await this.overview();
    const created: string[] = [];

    if (overview.plaid.loginRequired > 5) {
      created.push(
        await this.upsertAlert(
          'plaid_login_required_spike',
          'warning',
          'Plaid login_required spike',
          `${overview.plaid.loginRequired} items require re-authentication`,
          { count: overview.plaid.loginRequired },
        ),
      );
    }
    if (overview.ai30d.estimatedCostUsd > 50) {
      created.push(
        await this.upsertAlert(
          'ai_cost_high',
          'warning',
          'AI cost elevated',
          `Estimated 30d AI cost $${overview.ai30d.estimatedCostUsd}`,
          { cost: overview.ai30d.estimatedCostUsd },
        ),
      );
    }
    if (overview.pastDue > 0) {
      created.push(
        await this.upsertAlert(
          'billing_past_due',
          'critical',
          'Past-due subscriptions',
          `${overview.pastDue} subscriptions are past_due`,
          { count: overview.pastDue },
        ),
      );
    }

    return { created: created.filter(Boolean), overview };
  }

  private async upsertAlert(
    key: string,
    severity: string,
    title: string,
    message: string,
    metadata: Record<string, unknown>,
  ) {
    const [existing] = await this.db
      .select()
      .from(platformAlerts)
      .where(and(eq(platformAlerts.key, key), eq(platformAlerts.status, 'open')))
      .limit(1);
    if (existing) return existing.id;
    const [row] = await this.db
      .insert(platformAlerts)
      .values({ key, severity, title, message, metadataJson: metadata })
      .returning();
    return row.id;
  }

  async weeklyScorecard() {
    const overview = await this.overview();
    const funnel = await this.funnel();
    const insights = await this.insightsSummary();
    const plaid = await this.plaidHealth();
    const scorecard = {
      weekOf: new Date().toISOString().slice(0, 10),
      overview,
      funnel,
      insights,
      plaidBroken: plaid.brokenItems.length,
      killSwitches: KILL_SWITCHES.map((k) => ({
        ...k,
        enabled: process.env[k.key] !== 'false',
      })),
    };

    await this.db
      .insert(platformMetricSnapshots)
      .values({
        snapshotDate: scorecard.weekOf,
        metricsJson: scorecard as unknown as Record<string, unknown>,
      })
      .onConflictDoUpdate({
        target: platformMetricSnapshots.snapshotDate,
        set: { metricsJson: scorecard as unknown as Record<string, unknown> },
      });

    return scorecard;
  }
}

@Injectable()
export class AdminControlService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
    private billing: BillingService,
  ) {}

  async updateOrgPlan(
    orgId: string,
    planTier: PlanTier,
    reason: string,
    actor: PlatformAdminContext,
  ) {
    const [before] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!before) throw new NotFoundException('Organization not found');

    const [after] = await this.db
      .update(organizations)
      .set({ planTier })
      .where(eq(organizations.id, orgId))
      .returning();

    await this.rbac.writeAudit({
      actor,
      permission: 'billing:write',
      action: 'org.plan.update',
      entityType: 'organization',
      entityId: orgId,
      targetOrgId: orgId,
      reason,
      before,
      after,
    });

    return after;
  }

  async updateOrgStatus(
    orgId: string,
    status: 'active' | 'suspended' | 'pending_deletion',
    reason: string,
    actor: PlatformAdminContext,
  ) {
    const [before] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!before) throw new NotFoundException('Organization not found');
    const [after] = await this.db
      .update(organizations)
      .set({ status })
      .where(eq(organizations.id, orgId))
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'orgs:write',
      action: 'org.status.update',
      entityType: 'organization',
      entityId: orgId,
      targetOrgId: orgId,
      reason,
      before,
      after,
    });
    return after;
  }

  async updateMemberRole(
    orgId: string,
    userId: string,
    role: 'owner' | 'admin' | 'viewer',
    reason: string,
    actor: PlatformAdminContext,
  ) {
    const [before] = await this.db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, userId)))
      .limit(1);
    if (!before) throw new NotFoundException('Membership not found');
    const [after] = await this.db
      .update(organizationMembers)
      .set({ role })
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, userId)))
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'orgs:write',
      action: 'org.member.role.update',
      entityType: 'organization_member',
      entityId: `${orgId}:${userId}`,
      targetOrgId: orgId,
      reason,
      before,
      after,
    });
    return after;
  }

  async listFlags() {
    const rows = await this.db.select().from(featureFlags);
    const defaults: Record<string, boolean> = {
      ai_agents: true,
      monte_carlo: true,
      tax_center: true,
      advisor_portal: false,
      voice_interface: false,
      graphql_api: false,
    };
    const byKey = new Map(rows.map((r) => [r.key, r]));
    const keys = new Set([...Object.keys(defaults), ...rows.map((r) => r.key)]);
    return [...keys].map((key) => {
      const row = byKey.get(key);
      return {
        key,
        enabled: row?.enabled ?? defaults[key] ?? false,
        orgOverridesJson: row?.orgOverridesJson ?? {},
        id: row?.id ?? null,
        source: row ? 'db' : 'default',
      };
    });
  }

  async upsertFlag(
    key: string,
    enabled: boolean,
    orgOverrides: Record<string, boolean> | undefined,
    reason: string,
    actor: PlatformAdminContext,
  ) {
    const [existing] = await this.db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
    let after;
    if (existing) {
      [after] = await this.db
        .update(featureFlags)
        .set({
          enabled,
          orgOverridesJson: orgOverrides ?? existing.orgOverridesJson ?? {},
        })
        .where(eq(featureFlags.id, existing.id))
        .returning();
    } else {
      [after] = await this.db
        .insert(featureFlags)
        .values({ key, enabled, orgOverridesJson: orgOverrides ?? {} })
        .returning();
    }
    await this.rbac.writeAudit({
      actor,
      permission: 'flags:write',
      action: 'feature_flag.upsert',
      entityType: 'feature_flag',
      entityId: after.id,
      reason,
      before: existing ?? undefined,
      after,
    });
    return after;
  }

  async createEntitlementOverride(
    orgId: string,
    data: {
      maxBanks?: number;
      maxAiMessagesMonthly?: number;
      maxDocuments?: number;
      historyDays?: number;
      reason: string;
      expiresAt?: string;
    },
    actor: PlatformAdminContext,
  ) {
    const [row] = await this.db
      .insert(entitlementOverrides)
      .values({
        orgId,
        maxBanks: data.maxBanks,
        maxAiMessagesMonthly: data.maxAiMessagesMonthly,
        maxDocuments: data.maxDocuments,
        historyDays: data.historyDays,
        reason: data.reason,
        grantedByEmail: actor.email,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      })
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'billing:write',
      action: 'entitlement_override.create',
      entityType: 'entitlement_override',
      entityId: row.id,
      targetOrgId: orgId,
      reason: data.reason,
      after: row,
    });
    return row;
  }

  async createCompGrant(
    orgId: string,
    planTier: PlanTier,
    reason: string,
    expiresAt: string | undefined,
    actor: PlatformAdminContext,
  ) {
    await this.updateOrgPlan(orgId, planTier, reason, actor);
    const [row] = await this.db
      .insert(complimentaryGrants)
      .values({
        orgId,
        planTier,
        reason,
        grantedByEmail: actor.email,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'billing:write',
      action: 'comp_grant.create',
      entityType: 'complimentary_grant',
      entityId: row.id,
      targetOrgId: orgId,
      reason,
      after: row,
    });
    return row;
  }

  async listSubscriptions(opts: { status?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, opts.pageSize ?? 25);
    const offset = (page - 1) * pageSize;
    const where = opts.status ? eq(subscriptions.status, opts.status) : undefined;
    const [totalRow] = await this.db.select({ total: count() }).from(subscriptions).where(where);
    const rows = await this.db
      .select({
        id: subscriptions.id,
        orgId: subscriptions.orgId,
        orgName: organizations.name,
        planTier: subscriptions.planTier,
        status: subscriptions.status,
        stripeCustomerId: subscriptions.stripeCustomerId,
        stripeSubscriptionId: subscriptions.stripeSubscriptionId,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        orgStripeCustomerId: organizations.stripeCustomerId,
      })
      .from(subscriptions)
      .leftJoin(organizations, eq(organizations.id, subscriptions.orgId))
      .where(where)
      .orderBy(desc(subscriptions.currentPeriodEnd))
      .limit(pageSize)
      .offset(offset);

    const mrrEstimate = rows
      .filter((r) => r.status === 'active' || r.status === 'trialing')
      .reduce((sum, r) => {
        const prices: Record<string, number> = { free: 0, pro: 29, family: 49, advisor: 99 };
        return sum + (prices[r.planTier] ?? 0);
      }, 0);

    return {
      data: rows.map((r) => ({
        ...r,
        stripeDashboardUrl: r.stripeCustomerId
          ? `https://dashboard.stripe.com/customers/${r.stripeCustomerId}`
          : r.orgStripeCustomerId
            ? `https://dashboard.stripe.com/customers/${r.orgStripeCustomerId}`
            : null,
      })),
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
      pageMrrEstimate: mrrEstimate,
    };
  }

  async usageOutliers() {
    const orgs = await this.db.select().from(organizations).where(eq(organizations.planTier, 'free')).limit(200);
    const outliers = [];
    for (const org of orgs.slice(0, 50)) {
      const summary = await this.billing.getPlanSummary(org.id);
      const banks = summary.usage?.banks ?? 0;
      const ai = summary.usage?.aiMessagesThisMonth ?? 0;
      const bankLimit = summary.limits?.banks ?? 1;
      const aiLimit = summary.aiMessagesLimit ?? 30;
      if (banks >= bankLimit || (aiLimit !== null && ai >= aiLimit * 0.8)) {
        outliers.push({
          orgId: org.id,
          name: org.name,
          usage: summary.usage,
          limits: summary.limits,
          aiMessagesLimit: summary.aiMessagesLimit,
        });
      }
    }
    return { outliers };
  }
}
