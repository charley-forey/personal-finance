import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { eq, and, desc, count, isNull, sql, gte } from 'drizzle-orm';
import {
  type Database,
  organizations,
  users,
  organizationMembers,
  plaidItems,
  apiKeys,
  advisorFirms,
  advisorClients,
  promptVersions,
  modelEvaluations,
  supportNotes,
  supportCases,
  impersonationSessions,
  dsarRequests,
  auditLogs,
  userSignals,
  featureFlags,
} from '@pf/database';
import type { PlatformAdminContext } from '@pf/shared';
import { DATABASE } from '../../database.module';
import { AdminRbacService } from './admin-directory.service';
import { ComplianceService } from '../../services/platform.services';

const KILL_SWITCHES = [
  { key: 'AI_ENABLED', label: 'AI / LLM', description: 'Disable agent chat, embeddings, document extraction' },
  { key: 'PLAID_SYNC_ENABLED', label: 'Plaid sync', description: 'Skip enqueueing / processing Plaid sync jobs' },
  { key: 'INTELLIGENCE_JOBS_ENABLED', label: 'Intelligence jobs', description: 'Skip learning-loop workers' },
  { key: 'EVENT_PIPELINE_ENABLED', label: 'Event pipeline', description: 'Skip domain-event processing' },
  { key: 'SSE_ENABLED', label: 'SSE stream', description: 'Disable /events/stream' },
  { key: 'ADVISOR_PORTAL_ENABLED', label: 'Advisor portal', description: 'Force advisor routes to stub' },
] as const;

export const SUPPORT_PLAYBOOKS = [
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
export class AdminOpsReliabilityService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
  ) {}

  async queueStatus() {
    // Best-effort BullMQ introspection; degrade gracefully without Redis
    const queueNames = ['plaid-sync', 'daily-rollup', 'ai-insights', 'notifications'];
    try {
      const { Queue } = await import('bullmq');
      const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379', maxRetriesPerRequest: null };
      const results = [];
      for (const name of queueNames) {
        const q = new Queue(name, { connection });
        try {
          const [waiting, active, completed, failed, delayed] = await Promise.all([
            q.getWaitingCount(),
            q.getActiveCount(),
            q.getCompletedCount(),
            q.getFailedCount(),
            q.getDelayedCount(),
          ]);
          const failedJobs = await q.getFailed(0, 19);
          results.push({
            name,
            waiting,
            active,
            completed,
            failed,
            delayed,
            deadLetters: failedJobs.map((j) => ({
              id: j.id,
              name: j.name,
              failedReason: j.failedReason,
              attemptsMade: j.attemptsMade,
              data: j.data,
              timestamp: j.timestamp,
            })),
          });
        } finally {
          await q.close();
        }
      }
      return { available: true, queues: results };
    } catch (err) {
      return {
        available: false,
        error: err instanceof Error ? err.message : 'Redis unavailable',
        queues: queueNames.map((name) => ({
          name,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          deadLetters: [],
        })),
      };
    }
  }

  async redriveFailed(queueName: string, jobId: string, actor: PlatformAdminContext) {
    try {
      const { Queue } = await import('bullmq');
      const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379', maxRetriesPerRequest: null };
      const q = new Queue(queueName, { connection });
      try {
        const job = await q.getJob(jobId);
        if (!job) throw new NotFoundException('Job not found');
        await job.retry();
        await this.rbac.writeAudit({
          actor,
          permission: 'queues:manage',
          action: 'queue.redrive',
          entityType: 'bullmq_job',
          entityId: jobId,
          reason: `Redrive ${queueName}/${jobId}`,
          metadata: { queueName },
        });
        return { redriven: true, queueName, jobId };
      } finally {
        await q.close();
      }
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new BadRequestException(err instanceof Error ? err.message : 'Redrive failed');
    }
  }

  killSwitches() {
    return KILL_SWITCHES.map((k) => ({
      ...k,
      // unset = enabled; explicit false = killed
      enabled: process.env[k.key] !== 'false',
      note: 'Env kill switches require process restart to change; UI reflects current process env.',
    }));
  }

  async forceSyncItem(itemId: string, actor: PlatformAdminContext) {
    const [item] = await this.db
      .select({
        id: plaidItems.id,
        orgId: plaidItems.orgId,
        syncStatus: plaidItems.syncStatus,
        loginRequired: plaidItems.loginRequired,
      })
      .from(plaidItems)
      .where(eq(plaidItems.id, itemId))
      .limit(1);
    if (!item) throw new NotFoundException('Plaid item not found');

    const [after] = await this.db
      .update(plaidItems)
      .set({ syncStatus: 'pending', errorCode: null })
      .where(eq(plaidItems.id, itemId))
      .returning({
        id: plaidItems.id,
        orgId: plaidItems.orgId,
        syncStatus: plaidItems.syncStatus,
        loginRequired: plaidItems.loginRequired,
      });

    try {
      const { Queue } = await import('bullmq');
      const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379', maxRetriesPerRequest: null };
      const q = new Queue('plaid-sync', { connection });
      await q.add('sync', { itemId: item.id, orgId: item.orgId });
      await q.close();
    } catch {
      // queue optional
    }

    await this.rbac.writeAudit({
      actor,
      permission: 'queues:manage',
      action: 'plaid.force_sync',
      entityType: 'plaid_item',
      entityId: itemId,
      targetOrgId: item.orgId,
      before: item,
      after,
    });

    return after;
  }

  async incidentMode(enable: boolean, reason: string, actor: PlatformAdminContext) {
    // Soft incident mode via feature flags (process env kill switches still need restart)
    const keys = ['ai_agents', 'monte_carlo'];
    const results = [];
    for (const key of keys) {
      const [existing] = await this.db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
      let after;
      if (existing) {
        [after] = await this.db
          .update(featureFlags)
          .set({ enabled: !enable })
          .where(eq(featureFlags.id, existing.id))
          .returning();
      } else {
        [after] = await this.db
          .insert(featureFlags)
          .values({ key, enabled: !enable, orgOverridesJson: {} })
          .returning();
      }
      results.push(after);
    }

    await this.rbac.writeAudit({
      actor,
      permission: 'flags:write',
      action: enable ? 'incident.enable' : 'incident.disable',
      entityType: 'incident_mode',
      entityId: 'global',
      reason,
      after: { flags: results, enable },
      metadata: {
        blastRadius: 'All orgs — AI feature flags toggled',
        killSwitchReminder: 'Set AI_ENABLED=false / PLAID_SYNC_ENABLED=false and restart for hard stop',
      },
    });

    return {
      incidentMode: enable,
      flags: results,
      killSwitches: this.killSwitches(),
    };
  }

  async deepHealth() {
    let dbOk = false;
    try {
      await this.db.select({ total: count() }).from(organizations).limit(1);
      dbOk = true;
    } catch {
      dbOk = false;
    }

    let redisOk = false;
    try {
      const { Queue } = await import('bullmq');
      const q = new Queue('plaid-sync', {
        connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379', maxRetriesPerRequest: null },
      });
      await q.getWaitingCount();
      redisOk = true;
      await q.close();
    } catch {
      redisOk = false;
    }

    return {
      db: dbOk,
      redis: redisOk,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      plaidConfigured: Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET),
      llmConfigured: Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('1234567890')),
      sentryConfigured: Boolean(process.env.SENTRY_DSN),
      environment: process.env.NODE_ENV ?? 'development',
      killSwitches: this.killSwitches(),
    };
  }
}

@Injectable()
export class AdminSupportService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
  ) {}

  playbooks() {
    return SUPPORT_PLAYBOOKS;
  }

  async addNote(orgId: string, body: string, actor: PlatformAdminContext) {
    const [org] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!org) throw new NotFoundException('Organization not found');
    const [note] = await this.db
      .insert(supportNotes)
      .values({
        orgId,
        body,
        authorEmail: actor.email,
        authorUserId: actor.userId.startsWith('api-key:') ? null : actor.userId,
      })
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'support:write',
      action: 'support.note.create',
      entityType: 'support_note',
      entityId: note.id,
      targetOrgId: orgId,
      after: note,
    });
    return note;
  }

  async createCase(
    orgId: string,
    data: { subject: string; priority?: string; playbookKey?: string },
    actor: PlatformAdminContext,
  ) {
    const [row] = await this.db
      .insert(supportCases)
      .values({
        orgId,
        subject: data.subject,
        priority: data.priority ?? 'normal',
        playbookKey: data.playbookKey,
        createdByEmail: actor.email,
        assigneeEmail: actor.email,
      })
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'support:write',
      action: 'support.case.create',
      entityType: 'support_case',
      entityId: row.id,
      targetOrgId: orgId,
      after: row,
    });
    return row;
  }

  async listCases(status?: string) {
    const rows = status
      ? await this.db
          .select()
          .from(supportCases)
          .where(eq(supportCases.status, status))
          .orderBy(desc(supportCases.updatedAt))
          .limit(100)
      : await this.db.select().from(supportCases).orderBy(desc(supportCases.updatedAt)).limit(100);
    return { data: rows };
  }

  async updateCaseStatus(id: string, status: string, actor: PlatformAdminContext) {
    const [before] = await this.db.select().from(supportCases).where(eq(supportCases.id, id)).limit(1);
    if (!before) throw new NotFoundException('Case not found');
    const [after] = await this.db
      .update(supportCases)
      .set({
        status,
        updatedAt: new Date(),
        closedAt: status === 'closed' ? new Date() : null,
      })
      .where(eq(supportCases.id, id))
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'support:write',
      action: 'support.case.update',
      entityType: 'support_case',
      entityId: id,
      targetOrgId: before.orgId,
      before,
      after,
    });
    return after;
  }

  async startImpersonation(
    orgId: string,
    reason: string,
    actor: PlatformAdminContext,
    opts?: { targetUserId?: string; minutes?: number; stepUpToken?: string },
  ) {
    if (!reason.trim()) throw new BadRequestException('Reason required');
    // Step-up: require explicit confirmation token in production-like flows
    if (process.env.NODE_ENV === 'production' && opts?.stepUpToken !== 'confirmed') {
      throw new ForbiddenException('Step-up confirmation required (stepUpToken=confirmed)');
    }

    const [org] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!org) throw new NotFoundException('Organization not found');

    const minutes = Math.min(120, Math.max(5, opts?.minutes ?? 30));
    const expiresAt = new Date(Date.now() + minutes * 60_000);

    const [session] = await this.db
      .insert(impersonationSessions)
      .values({
        actorEmail: actor.email,
        actorUserId: actor.userId.startsWith('api-key:') ? null : actor.userId,
        targetOrgId: orgId,
        targetUserId: opts?.targetUserId,
        reason,
        expiresAt,
        metadataJson: { stepUp: true },
      })
      .returning();

    await this.rbac.writeAudit({
      actor,
      permission: 'impersonate',
      action: 'impersonation.start',
      entityType: 'impersonation_session',
      entityId: session.id,
      targetOrgId: orgId,
      reason,
      after: session,
    });

    return {
      session,
      watermark: 'SUPPORT SESSION',
      expiresAt,
      banner: `Viewing as org ${org.name} — actions are audited`,
    };
  }

  async revokeImpersonation(sessionId: string, actor: PlatformAdminContext) {
    const [before] = await this.db
      .select()
      .from(impersonationSessions)
      .where(eq(impersonationSessions.id, sessionId))
      .limit(1);
    if (!before) throw new NotFoundException('Session not found');
    const [after] = await this.db
      .update(impersonationSessions)
      .set({ revokedAt: new Date() })
      .where(eq(impersonationSessions.id, sessionId))
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'impersonate',
      action: 'impersonation.revoke',
      entityType: 'impersonation_session',
      entityId: sessionId,
      targetOrgId: before.targetOrgId,
      before,
      after,
    });
    return after;
  }

  async activeImpersonations(actorEmail?: string) {
    const now = new Date();
    const rows = await this.db
      .select()
      .from(impersonationSessions)
      .where(and(isNull(impersonationSessions.revokedAt), gte(impersonationSessions.expiresAt, now)))
      .orderBy(desc(impersonationSessions.startedAt))
      .limit(50);
    return {
      data: actorEmail ? rows.filter((r) => r.actorEmail === actorEmail) : rows,
    };
  }
}

@Injectable()
export class AdminTrustService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
    private compliance: ComplianceService,
  ) {}

  async searchTenantAudit(opts: { q?: string; orgId?: string; limit?: number }) {
    const limit = Math.min(opts.limit ?? 100, 500);
    let rows = await this.db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
    if (opts.orgId) rows = rows.filter((r) => r.orgId === opts.orgId);
    if (opts.q) {
      const q = opts.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.action.toLowerCase().includes(q) ||
          (r.entityId ?? '').toLowerCase().includes(q) ||
          (r.entityType ?? '').toLowerCase().includes(q),
      );
    }
    return { results: rows };
  }

  async createDsar(
    data: { orgId: string; userId?: string; requestType: 'export' | 'delete'; reason?: string },
    actor: PlatformAdminContext,
  ) {
    const [row] = await this.db
      .insert(dsarRequests)
      .values({
        orgId: data.orgId,
        userId: data.userId,
        requestType: data.requestType,
        reason: data.reason,
        requestedByEmail: actor.email,
        status: 'pending',
      })
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'dsar:execute',
      action: 'dsar.create',
      entityType: 'dsar_request',
      entityId: row.id,
      targetOrgId: data.orgId,
      reason: data.reason,
      after: row,
    });
    return row;
  }

  async listDsar() {
    return this.db.select().from(dsarRequests).orderBy(desc(dsarRequests.createdAt)).limit(100);
  }

  async approveDsar(id: string, actor: PlatformAdminContext) {
    const [before] = await this.db.select().from(dsarRequests).where(eq(dsarRequests.id, id)).limit(1);
    if (!before) throw new NotFoundException('DSAR not found');
    if (before.requestedByEmail === actor.email && before.requestType === 'delete') {
      throw new ForbiddenException('Dual control required: approver must differ from requester for delete');
    }
    const [after] = await this.db
      .update(dsarRequests)
      .set({ status: 'approved', approvedByEmail: actor.email })
      .where(eq(dsarRequests.id, id))
      .returning();
    await this.rbac.writeAudit({
      actor,
      permission: 'dsar:execute',
      action: 'dsar.approve',
      entityType: 'dsar_request',
      entityId: id,
      targetOrgId: before.orgId,
      before,
      after,
    });
    return after;
  }

  async executeDsar(id: string, actor: PlatformAdminContext) {
    const [req] = await this.db.select().from(dsarRequests).where(eq(dsarRequests.id, id)).limit(1);
    if (!req) throw new NotFoundException('DSAR not found');
    if (req.status !== 'approved' && req.requestType === 'delete') {
      throw new BadRequestException('Delete DSAR must be approved first');
    }

    let result: Record<string, unknown>;
    if (req.requestType === 'export') {
      const members = await this.db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.orgId, req.orgId))
        .limit(1);
      const userId = req.userId ?? members[0]?.userId;
      if (!userId) throw new BadRequestException('No user for export');
      result = (await this.compliance.exportOrgData(req.orgId, userId)) as unknown as Record<string, unknown>;
    } else {
      const userId = req.userId;
      if (!userId) throw new BadRequestException('userId required for delete');
      if (req.approvedByEmail === actor.email && req.requestedByEmail === actor.email) {
        throw new ForbiddenException('Dual control required for delete execution');
      }
      result = (await this.compliance.deleteAccount(req.orgId, userId)) as unknown as Record<string, unknown>;
    }

    const [after] = await this.db
      .update(dsarRequests)
      .set({ status: 'completed', completedAt: new Date(), resultJson: result })
      .where(eq(dsarRequests.id, id))
      .returning();

    await this.rbac.writeAudit({
      actor,
      permission: 'dsar:execute',
      action: 'dsar.execute',
      entityType: 'dsar_request',
      entityId: id,
      targetOrgId: req.orgId,
      after,
      metadata: { requestType: req.requestType },
    });

    return { request: after, result };
  }

  async accessReview() {
    const admins = await this.rbac.listAdmins();
    return {
      platformAdmins: admins,
      reviewedAt: new Date().toISOString(),
      attestationRequired: true,
    };
  }

  async ssoStatus() {
    return {
      enabled: false,
      scim: false,
      provider: 'workos',
      note: 'Org SSO/SCIM not wired — see ADR 001 / WP-031',
      sample: this.compliance.getSsoConfig('platform'),
    };
  }

  async evidencePack() {
    const adminAudit = await this.rbac.listAdminAudit({ limit: 50 });
    const access = await this.accessReview();
    const flags = await this.db.select().from(featureFlags).limit(50);
    return {
      generatedAt: new Date().toISOString(),
      controls: {
        platformRbac: true,
        adminAudit: true,
        dsarWorkspace: true,
        featureFlags: true,
        killSwitches: true,
      },
      sampleAdminAudit: adminAudit.results.slice(0, 20),
      accessReview: access,
      featureFlags: flags,
    };
  }
}

@Injectable()
export class AdminAiGovService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
  ) {}

  async listPrompts() {
    return this.db.select().from(promptVersions).orderBy(desc(promptVersions.createdAt)).limit(100);
  }

  async activatePrompt(id: string, actor: PlatformAdminContext) {
    const [prompt] = await this.db.select().from(promptVersions).where(eq(promptVersions.id, id)).limit(1);
    if (!prompt) throw new NotFoundException('Prompt version not found');

    await this.db
      .update(promptVersions)
      .set({ isActive: false })
      .where(and(eq(promptVersions.agentType, prompt.agentType), eq(promptVersions.isActive, true)));

    const [after] = await this.db
      .update(promptVersions)
      .set({ isActive: true })
      .where(eq(promptVersions.id, id))
      .returning();

    await this.rbac.writeAudit({
      actor,
      permission: 'ai:gov',
      action: 'prompt.activate',
      entityType: 'prompt_version',
      entityId: id,
      before: prompt,
      after,
    });
    return after;
  }

  async listEvals() {
    return this.db.select().from(modelEvaluations).orderBy(desc(modelEvaluations.evaluatedAt)).limit(100);
  }

  async copilot(question: string, actor: PlatformAdminContext) {
    const q = question.toLowerCase();
    const proposals: Array<{ action: string; permission: string; summary: string; confirmRequired: boolean }> = [];

    const [orgCount] = await this.db.select({ total: count() }).from(organizations);
    const broken = await this.db
      .select({ total: count() })
      .from(plaidItems)
      .where(eq(plaidItems.loginRequired, true));

    let answer = `Platform Ops Copilot for ${actor.email}. `;

    if (q.includes('plaid') || q.includes('sync') || q.includes('bank')) {
      answer += `There are ${Number(broken[0]?.total ?? 0)} Plaid items with login_required. `;
      proposals.push({
        action: 'open_plaid_health',
        permission: 'queues:manage',
        summary: 'Open Plaid health and force-sync broken items',
        confirmRequired: true,
      });
    } else if (q.includes('flag') || q.includes('kill')) {
      answer += 'Feature flags and kill switches are available under Ops. ';
      proposals.push({
        action: 'incident_mode',
        permission: 'flags:write',
        summary: 'Enable incident mode (disables AI feature flags)',
        confirmRequired: true,
      });
    } else if (q.includes('mrr') || q.includes('billing') || q.includes('churn')) {
      answer += 'Open FinOps for subscription directory and past_due queue. ';
      proposals.push({
        action: 'open_billing',
        permission: 'billing:read',
        summary: 'Review subscriptions and usage outliers',
        confirmRequired: false,
      });
    } else {
      answer += `Tracking ${Number(orgCount?.total ?? 0)} organizations. Ask about Plaid, billing, flags, or AI cost.`;
    }

    await this.rbac.writeAudit({
      actor,
      permission: 'ai:gov',
      action: 'copilot.query',
      entityType: 'platform_ops_copilot',
      reason: question.slice(0, 500),
      metadata: { proposals },
    });

    return {
      answer,
      proposals,
      citations: ['organizations', 'plaid_items', 'feature_flags', 'subscriptions'],
      disclaimer: 'Proposals require human confirmation and matching permission before execution.',
    };
  }
}

@Injectable()
export class AdminScaleService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private rbac: AdminRbacService,
  ) {}

  async listFirms() {
    const firms = await this.db.select().from(advisorFirms).orderBy(desc(advisorFirms.name));
    const clients = await this.db.select().from(advisorClients);
    return {
      firms: firms.map((f) => ({
        ...f,
        clientCount: clients.filter((c) => c.firmId === f.id).length,
      })),
      clients,
    };
  }

  async apiKeyAbuse() {
    const keys = await this.db
      .select({
        id: apiKeys.id,
        orgId: apiKeys.orgId,
        name: apiKeys.name,
        lastUsedAt: apiKeys.lastUsedAt,
        scopesJson: apiKeys.scopesJson,
        expiresAt: apiKeys.expiresAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.lastUsedAt))
      .limit(100);

    const stale = keys.filter((k) => !k.lastUsedAt || k.lastUsedAt < new Date(Date.now() - 90 * 86400000));
    const adminScoped = keys.filter((k) => (k.scopesJson ?? []).includes('admin'));

    return {
      total: keys.length,
      stale90d: stale,
      adminScoped,
      keys,
    };
  }

  async webhookHealth() {
    // Plaid webhook events as proxy; Stripe webhooks are not persisted yet
    const { plaidWebhookEvents } = await import('@pf/database');
    const pending = await this.db
      .select({ total: count() })
      .from(plaidWebhookEvents)
      .where(eq(plaidWebhookEvents.status, 'pending'));
    const failed = await this.db
      .select({ total: count() })
      .from(plaidWebhookEvents)
      .where(eq(plaidWebhookEvents.status, 'error'));
    const recent = await this.db
      .select({
        id: plaidWebhookEvents.id,
        orgId: plaidWebhookEvents.orgId,
        webhookType: plaidWebhookEvents.webhookType,
        webhookCode: plaidWebhookEvents.webhookCode,
        status: plaidWebhookEvents.status,
        createdAt: plaidWebhookEvents.createdAt,
      })
      .from(plaidWebhookEvents)
      .orderBy(desc(plaidWebhookEvents.createdAt))
      .limit(50);

    return {
      plaid: {
        pending: Number(pending[0]?.total ?? 0),
        failed: Number(failed[0]?.total ?? 0),
        recent,
      },
      stripe: {
        note: 'Stripe webhook delivery is not persisted in-app; use Stripe Dashboard.',
      },
    };
  }

  async experiments() {
    const exposures = await this.db
      .select({
        signalType: userSignals.signalType,
        total: count(),
      })
      .from(userSignals)
      .where(sql`${userSignals.signalType} like 'experiment.%' or ${userSignals.signalType} like 'wva.%'`)
      .groupBy(userSignals.signalType)
      .orderBy(desc(count()))
      .limit(50);

    const flags = await this.db.select().from(featureFlags);
    return {
      flagBacked: flags.map((f) => ({
        key: f.key,
        enabled: f.enabled,
        overrideCount: Object.keys(f.orgOverridesJson ?? {}).length,
      })),
      exposures: exposures.map((e) => ({ type: e.signalType, count: Number(e.total) })),
    };
  }

  async exportWarehouseSnapshot(actor: PlatformAdminContext) {
    const [orgTotal] = await this.db.select({ total: count() }).from(organizations);
    const [userTotal] = await this.db.select({ total: count() }).from(users);
    const snapshot = {
      date: new Date().toISOString().slice(0, 10),
      orgs: Number(orgTotal?.total ?? 0),
      users: Number(userTotal?.total ?? 0),
      exportedAt: new Date().toISOString(),
    };

    const { platformMetricSnapshots } = await import('@pf/database');
    await this.db
      .insert(platformMetricSnapshots)
      .values({
        snapshotDate: `warehouse-${snapshot.date}`,
        metricsJson: snapshot,
      })
      .onConflictDoUpdate({
        target: platformMetricSnapshots.snapshotDate,
        set: { metricsJson: snapshot },
      });

    await this.rbac.writeAudit({
      actor,
      permission: 'metrics:read',
      action: 'warehouse.export',
      entityType: 'platform_metric_snapshot',
      after: snapshot,
    });

    return snapshot;
  }
}
