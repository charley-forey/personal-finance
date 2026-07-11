import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, ne, desc } from 'drizzle-orm';
import {
  organizations,
  users,
  organizationMembers,
  auditLogs,
  accounts,
  transactions,
  notifications,
  notificationRules,
  featureFlags,
  advisorFirms,
  advisorClients,
  households,
  apiKeys,
  entities,
  equityGrants,
  lifePlans,
  scenarios,
  documents,
  taxProfiles,
  taxLots,
  tags,
  transactionTags,
  userPreferences,
  verifications,
  changeEvents,
  healthScores,
  agentMemories,
  agentRuns,
  agentConversations,
  plaidItems,
  financialGoals,
  organizationInvites,
  orgConsents,
  investmentHoldings,
  liabilities,
  recurringStreams,
  recommendationItems,
  insights,
  plaidPayloadArchive,
} from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { searchKnowledge, ingestKnowledgeBase } from '@pf/sync';
import { createOpenAIClient, generateEmbedding } from '@pf/ai';
import { resolve } from 'path';
import { createHash, randomBytes } from 'crypto';
import { PlaidService } from './core.services';
import type { MemberRole } from '@pf/shared';

export const DATA_CATALOG = [
  { key: 'accounts', label: 'Accounts', description: 'Linked bank and investment accounts', retainedUntil: 'Until disconnect wipe or account deletion' },
  { key: 'transactions', label: 'Transactions', description: 'Normalized spend/income history plus raw Plaid fields', retainedUntil: 'Until disconnect wipe or account deletion' },
  { key: 'holdings', label: 'Holdings', description: 'Investment positions snapshots', retainedUntil: 'Until disconnect wipe or account deletion' },
  { key: 'liabilities', label: 'Liabilities', description: 'Credit and loan details', retainedUntil: 'Until disconnect wipe or account deletion' },
  { key: 'recurring', label: 'Recurring streams', description: 'Detected bills and subscriptions', retainedUntil: 'Until account deletion' },
  { key: 'insights', label: 'Insights', description: 'Generated financial insights', retainedUntil: 'Until account deletion' },
  { key: 'recommendations', label: 'Recommendations', description: 'Action queue items', retainedUntil: 'Until account deletion' },
  { key: 'agent_conversations', label: 'AI conversations', description: 'Agent chat history', retainedUntil: 'Until account deletion' },
  { key: 'documents', label: 'Documents', description: 'Uploaded tax and statement files', retainedUntil: 'Until account deletion' },
  { key: 'plaid_archive', label: 'Raw Plaid archive', description: 'Full provider payloads for support/replay', retainedUntil: 'Until account deletion' },
  { key: 'audit_logs', label: 'Audit logs', description: 'Security and compliance events', retainedUntil: 'Long retention / legal hold' },
] as const;

export const CONSENT_PURPOSES = ['ai_full_context', 'advisor_sharing', 'marketing'] as const;

@Injectable()
export class NotificationService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async sendEmail(to: string, subject: string, body: string) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log(`[email] To: ${to}, Subject: ${subject}`);
      return { sent: false, reason: 'SendGrid not configured' };
    }

    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@personalfinance.os' },
          subject,
          content: [{ type: 'text/html', value: body }],
        }),
      });
      return { sent: res.ok };
    } catch {
      return { sent: false, reason: 'SendGrid request failed' };
    }
  }

  async sendSms(to: string, body: string) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!sid || !token || !from) {
      console.log(`[sms] To: ${to}: ${body}`);
      return { sent: false, reason: 'Twilio not configured' };
    }

    try {
      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      });
      return { sent: res.ok };
    } catch {
      return { sent: false, reason: 'Twilio request failed' };
    }
  }

  async createNotification(orgId: string, data: { type: string; title: string; body: string; userId?: string; channel?: 'in_app' | 'email' | 'sms' }) {
    const [n] = await this.db
      .insert(notifications)
      .values({
        orgId,
        userId: data.userId,
        channel: data.channel ?? 'in_app',
        type: data.type,
        title: data.title,
        body: data.body,
        sentAt: new Date(),
      })
      .returning();
    return n;
  }

  async markRead(notificationId: string, orgId: string) {
    const [n] = await this.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.id, notificationId), eq(notifications.orgId, orgId)))
      .returning();
    return n;
  }

  async sendWeeklyDigest(orgId: string, email: string, summary: { netWorth: number; change: number; insights: string[] }) {
    const body = `
      <h2>Your Weekly Financial Digest</h2>
      <p>Net Worth: $${summary.netWorth.toFixed(2)} (${summary.change >= 0 ? '+' : ''}$${summary.change.toFixed(2)})</p>
      <h3>Insights</h3>
      <ul>${summary.insights.map((i) => `<li>${i}</li>`).join('')}</ul>
    `;
    return this.sendEmail(email, 'Your Weekly Financial Digest', body);
  }
}

@Injectable()
export class FeatureFlagService {
  private defaults: Record<string, boolean> = {
    ai_agents: true,
    monte_carlo: true,
    tax_center: true,
    advisor_portal: false,
    voice_interface: false,
    graphql_api: false,
  };

  constructor(@Inject(DATABASE) private db: Database) {}

  async isEnabled(key: string, orgId?: string): Promise<boolean> {
    const [flag] = await this.db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
    if (flag) {
      if (orgId && flag.orgOverridesJson?.[orgId] !== undefined) {
        return flag.orgOverridesJson[orgId]!;
      }
      return flag.enabled;
    }
    return this.defaults[key] ?? false;
  }
}

@Injectable()
export class AdminService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async searchOrgs(query: string) {
    const orgs = await this.db.select().from(organizations).limit(50);
    const filtered = query
      ? orgs.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
      : orgs;
    return { query, results: filtered };
  }
}

@Injectable()
export class IntegrationService {
  async listProviders() {
    return ['slack', 'zapier', 'quickbooks', 'google_sheets'];
  }
}

@Injectable()
export class ReportService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async generateCpaPack(orgId: string) {
    const { transactions: txns, pnlPeriods, pnlCells, dailyOrgSnapshots } = await import('@pf/database');
    const { eq: eqOp, desc: descOp } = await import('drizzle-orm');

    const txnList = await this.db.select().from(txns).where(eqOp(txns.orgId, orgId)).limit(10000);
    const snapshots = await this.db
      .select()
      .from(dailyOrgSnapshots)
      .where(eqOp(dailyOrgSnapshots.orgId, orgId))
      .orderBy(descOp(dailyOrgSnapshots.snapshotDate))
      .limit(365);

    const txnCsv = [
      'date,name,amount,category',
      ...txnList.map((t) => `${t.date},"${t.name}",${t.amount},${t.plaidCategoryPrimary ?? ''}`),
    ].join('\n');

    return {
      orgId,
      files: [
        { name: 'transactions.csv', content: txnCsv, mimeType: 'text/csv' },
        { name: 'net-worth-history.json', content: JSON.stringify(snapshots), mimeType: 'application/json' },
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}

@Injectable()
export class VerificationService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async runReconciliation(orgId: string) {
    const { accounts: accts, accountBalances, transactions: txns } = await import('@pf/database');
    const { eq: eqOp, desc: descOp } = await import('drizzle-orm');
    const { parseDecimal } = await import('@pf/shared');

    const orgAccounts = await this.db.select().from(accts).where(eqOp(accts.orgId, orgId));
    const issues: Array<{ accountId: string; expected: number; actual: number; variance: number }> = [];

    for (const acct of orgAccounts) {
      const [balance] = await this.db
        .select()
        .from(accountBalances)
        .where(eqOp(accountBalances.accountId, acct.id))
        .orderBy(descOp(accountBalances.capturedAt))
        .limit(1);

      const plaidBalance = parseDecimal(balance?.current);
      const accountTxns = await this.db.select().from(txns).where(eqOp(txns.accountId, acct.id)).limit(500);
      const txnSum = accountTxns.reduce((s, t) => s + parseDecimal(t.amount), 0);
      const variance = Math.abs(plaidBalance - txnSum);

      if (variance > 100) {
        issues.push({ accountId: acct.id, expected: plaidBalance, actual: txnSum, variance });
        await this.db.insert(verifications).values({
          orgId,
          verificationType: 'balance_reconciliation',
          status: 'pending',
          expectedJson: { balance: plaidBalance },
          actualJson: { txnSum },
          variance: variance.toString(),
        });
      }
    }

    return { orgId, status: issues.length ? 'issues_found' : 'reconciled', issues };
  }
}

@Injectable()
export class KnowledgeService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
  ) {}

  async search(query: string, domain?: string) {
    const apiKey = this.config.get('OPENAI_API_KEY');
    const embedFn =
      apiKey && !apiKey.includes('1234567890')
        ? async (text: string) => generateEmbedding(createOpenAIClient(apiKey), text)
        : undefined;

    const results = await searchKnowledge(this.db, query, domain, embedFn);
    return { query, domain, results };
  }

  async ingest() {
    const contentDir = resolve(process.cwd(), '../../content/knowledge');
    const apiKey = this.config.get('OPENAI_API_KEY');
    const embedFn =
      apiKey && !apiKey.includes('1234567890')
        ? async (text: string) => generateEmbedding(createOpenAIClient(apiKey), text)
        : undefined;
    return ingestKnowledgeBase(this.db, contentDir, embedFn);
  }
}

@Injectable()
export class AdvisorService {
  constructor(@Inject(DATABASE) private db: Database) {}

  /** Kill switch: ADVISOR_PORTAL_ENABLED=false disables all advisor routes. */
  assertPortalEnabled() {
    if (process.env.ADVISOR_PORTAL_ENABLED === 'false') {
      throw new NotFoundException('Advisor portal is disabled');
    }
  }

  async createFirm(name: string, ownerUserId: string) {
    this.assertPortalEnabled();
    const [firm] = await this.db
      .insert(advisorFirms)
      .values({ name, ownerUserId })
      .returning();
    return firm;
  }

  async assertFirmAccess(firmId: string, userId: string, isPlatformAdmin: boolean) {
    this.assertPortalEnabled();
    const [firm] = await this.db.select().from(advisorFirms).where(eq(advisorFirms.id, firmId)).limit(1);
    if (!firm) throw new NotFoundException('Advisor firm not found');
    if (isPlatformAdmin) return firm;
    if (firm.ownerUserId === userId) return firm;
    const [membership] = await this.db
      .select({ id: advisorClients.id })
      .from(advisorClients)
      .where(and(eq(advisorClients.firmId, firmId), eq(advisorClients.advisorUserId, userId)))
      .limit(1);
    if (!membership) throw new ForbiddenException('Not a member of this advisor firm');
    return firm;
  }

  /**
   * Link a client org to a firm. Callers may only link their own org unless platform admin.
   * Client owner must accept via status pending → active in Phase 5; for now owner links self.
   */
  async linkClient(
    firmId: string,
    orgId: string,
    caller: { userId: string; orgId: string; isPlatformAdmin: boolean },
    advisorUserId?: string,
  ) {
    await this.assertFirmAccess(firmId, caller.userId, caller.isPlatformAdmin);
    const targetOrgId = caller.isPlatformAdmin ? orgId : caller.orgId;
    if (!caller.isPlatformAdmin && orgId !== caller.orgId) {
      throw new ForbiddenException('Cannot link another organization as advisor client');
    }
    const [client] = await this.db
      .insert(advisorClients)
      .values({
        firmId,
        orgId: targetOrgId,
        advisorUserId: advisorUserId ?? caller.userId,
        status: 'pending',
        scopesJson: ['read_balances'],
      })
      .returning();
    return client;
  }

  async listClients(firmId: string, caller: { userId: string; isPlatformAdmin: boolean }) {
    await this.assertFirmAccess(firmId, caller.userId, caller.isPlatformAdmin);
    return this.db.select().from(advisorClients).where(eq(advisorClients.firmId, firmId));
  }

  async acceptClientInvite(clientId: string, orgId: string, userId: string) {
    this.assertPortalEnabled();
    const [row] = await this.db
      .select()
      .from(advisorClients)
      .where(and(eq(advisorClients.id, clientId), eq(advisorClients.orgId, orgId)))
      .limit(1);
    if (!row) throw new NotFoundException('Advisor client invite not found');
    const [updated] = await this.db
      .update(advisorClients)
      .set({ status: 'active' })
      .where(and(eq(advisorClients.id, clientId), eq(advisorClients.orgId, orgId)))
      .returning();
    return updated;
  }
}

@Injectable()
export class OrgMembersService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async list(orgId: string) {
    return this.db
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
  }

  async invite(orgId: string, invitedByUserId: string, email: string, role: MemberRole) {
    const normalized = email.toLowerCase().trim();
    const [existingUser] = await this.db.select().from(users).where(eq(users.email, normalized)).limit(1);
    if (existingUser) {
      const [existingMember] = await this.db
        .select()
        .from(organizationMembers)
        .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, existingUser.id)))
        .limit(1);
      if (existingMember) throw new ForbiddenException('User is already a member');
      const [member] = await this.db
        .insert(organizationMembers)
        .values({ orgId, userId: existingUser.id, role })
        .returning();
      await this.db.insert(auditLogs).values({
        orgId,
        userId: invitedByUserId,
        action: 'members.add',
        entityType: 'organization_member',
        entityId: existingUser.id,
        metadataJson: { role, email: normalized },
      });
      return {
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: member!.role,
        joinedAt: member!.joinedAt,
      };
    }

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const [invite] = await this.db
      .insert(organizationInvites)
      .values({
        orgId,
        email: normalized,
        role,
        invitedByUserId,
        status: 'pending',
        expiresAt,
      })
      .returning();
    await this.db.insert(auditLogs).values({
      orgId,
      userId: invitedByUserId,
      action: 'members.invite',
      entityType: 'organization_invite',
      entityId: invite!.id,
      metadataJson: { role, email: normalized },
    });
    return {
      userId: invite!.id,
      email: normalized,
      name: null,
      role,
      joinedAt: invite!.createdAt,
      pendingInvite: true,
    };
  }

  async updateRole(orgId: string, actorUserId: string, targetUserId: string, role: MemberRole) {
    if (role !== 'owner') {
      const owners = await this.db
        .select()
        .from(organizationMembers)
        .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.role, 'owner')));
      if (owners.length === 1 && owners[0]!.userId === targetUserId) {
        throw new ForbiddenException('Cannot demote the last owner');
      }
    }
    const [updated] = await this.db
      .update(organizationMembers)
      .set({ role })
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, targetUserId)))
      .returning();
    if (!updated) throw new NotFoundException('Member not found');
    await this.db.insert(auditLogs).values({
      orgId,
      userId: actorUserId,
      action: 'members.role_change',
      entityType: 'organization_member',
      entityId: targetUserId,
      metadataJson: { role },
    });
    const [u] = await this.db.select().from(users).where(eq(users.id, targetUserId)).limit(1);
    return {
      userId: targetUserId,
      email: u?.email ?? '',
      name: u?.name,
      role: updated.role,
      joinedAt: updated.joinedAt,
    };
  }

  async remove(orgId: string, actorUserId: string, targetUserId: string) {
    const [target] = await this.db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, targetUserId)))
      .limit(1);
    if (!target) throw new NotFoundException('Member not found');
    if (target.role === 'owner') {
      const owners = await this.db
        .select()
        .from(organizationMembers)
        .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.role, 'owner')));
      if (owners.length <= 1) throw new ForbiddenException('Cannot remove the last owner');
    }
    await this.db
      .delete(organizationMembers)
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.userId, targetUserId)));
    await this.db.insert(auditLogs).values({
      orgId,
      userId: actorUserId,
      action: 'members.remove',
      entityType: 'organization_member',
      entityId: targetUserId,
      metadataJson: {},
    });
    return { removed: true };
  }
}

@Injectable()
export class ConsentService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async list(orgId: string) {
    const rows = await this.db.select().from(orgConsents).where(eq(orgConsents.orgId, orgId));
    return CONSENT_PURPOSES.map((purpose) => {
      const row = rows.find((r) => r.purpose === purpose);
      return {
        purpose,
        version: row?.version ?? '1',
        granted: row?.granted ?? false,
        grantedAt: row?.grantedAt ?? null,
        revokedAt: row?.revokedAt ?? null,
      };
    });
  }

  async set(orgId: string, userId: string, purpose: string, granted: boolean) {
    if (!CONSENT_PURPOSES.includes(purpose as (typeof CONSENT_PURPOSES)[number])) {
      throw new ForbiddenException('Unknown consent purpose');
    }
    const now = new Date();
    const [existing] = await this.db
      .select()
      .from(orgConsents)
      .where(and(eq(orgConsents.orgId, orgId), eq(orgConsents.purpose, purpose)))
      .limit(1);
    if (existing) {
      const [updated] = await this.db
        .update(orgConsents)
        .set({
          granted,
          grantedAt: granted ? now : existing.grantedAt,
          revokedAt: granted ? null : now,
          updatedByUserId: userId,
        })
        .where(eq(orgConsents.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(orgConsents)
      .values({
        orgId,
        purpose,
        granted,
        grantedAt: granted ? now : null,
        revokedAt: granted ? null : now,
        updatedByUserId: userId,
      })
      .returning();
    await this.db.insert(auditLogs).values({
      orgId,
      userId,
      action: granted ? 'consent.grant' : 'consent.revoke',
      entityType: 'org_consent',
      entityId: purpose,
      metadataJson: { purpose, granted },
    });
    return created;
  }
}

@Injectable()
export class HouseholdService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async create(orgId: string, name: string) {
    const [household] = await this.db.insert(households).values({ orgId, name }).returning();
    return household;
  }

  async list(orgId: string) {
    return this.db.select().from(households).where(eq(households.orgId, orgId));
  }
}

@Injectable()
export class ApiKeyService {
  private static readonly VALID_SCOPES = new Set(['read', 'write', 'admin', 'reports']);

  constructor(@Inject(DATABASE) private db: Database) {}

  async create(orgId: string, name: string, scopes: string[]) {
    const normalizedScopes = scopes.filter((scope) => ApiKeyService.VALID_SCOPES.has(scope));
    if (!normalizedScopes.length) {
      throw new ForbiddenException('At least one valid scope is required (read, write, admin, reports).');
    }

    const rawKey = `pf_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const [key] = await this.db
      .insert(apiKeys)
      .values({ orgId, name, keyHash, scopesJson: normalizedScopes })
      .returning();
    return { ...key, rawKey };
  }

  async validate(rawKey: string): Promise<{ orgId: string; scopes: string[]; keyId: string } | null> {
    if (!rawKey.startsWith('pf_')) return null;

    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const [key] = await this.db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1);
    if (!key) return null;
    if (key.expiresAt && key.expiresAt < new Date()) return null;

    await this.db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, key.id));

    return {
      orgId: key.orgId,
      scopes: key.scopesJson ?? [],
      keyId: key.id,
    };
  }

  async list(orgId: string) {
    return this.db.select({ id: apiKeys.id, name: apiKeys.name, scopesJson: apiKeys.scopesJson, lastUsedAt: apiKeys.lastUsedAt }).from(apiKeys).where(eq(apiKeys.orgId, orgId));
  }

  async revoke(orgId: string, keyId: string) {
    const deleted = await this.db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.orgId, orgId)))
      .returning({ id: apiKeys.id });
    if (!deleted.length) throw new NotFoundException('API key not found');
    return { revoked: true };
  }
}

@Injectable()
export class ComplianceService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private plaid: PlaidService,
  ) {}

  async listAuditLogs(orgId: string, limit = 100) {
    return this.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.orgId, orgId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  getSsoConfig(orgId: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const workosReady = Boolean(process.env.WORKOS_CLIENT_ID && process.env.WORKOS_API_KEY);
    // Honest stub: user JWT auth via WorkOS AuthKit is live; org-level SAML/OIDC SSO is not.
    // TODO(WP-031): wire WorkOS Organization SSO (connections + domain verification) per org.
    return {
      orgId,
      enabled: false,
      status: 'not_configured' as const,
      provider: 'workos',
      ssoConfigured: false,
      workosAuthConfigured: workosReady,
      scimEnabled: false,
      metadataUrl: null,
      entityId: null,
      acsUrl: `${appUrl}/api/auth/sso/callback`,
      domains: [],
      message:
        'Enterprise SSO/SAML is not configured. WorkOS user auth may be available; org SSO requires WP-031 setup.',
    };
  }

  getAdvisorPortalStatus() {
    const envEnabled = process.env.ADVISOR_PORTAL_ENABLED !== 'false';
    return {
      status: envEnabled ? ('stub' as const) : ('disabled' as const),
      enabled: envEnabled,
      message: envEnabled
        ? 'Advisor portal firm/client routes exist with firm ownership checks — not a full advisor product surface.'
        : 'Advisor portal is disabled (ADVISOR_PORTAL_ENABLED=false).',
      features: {
        firmCrud: envEnabled,
        clientLinking: envEnabled,
        sharedDashboards: false,
        delegatedAccess: false,
      },
    };
  }

  async exportOrgData(orgId: string, userId: string) {
    const [org] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const members = await this.db.select().from(organizationMembers).where(eq(organizationMembers.orgId, orgId));
    const prefs = await this.db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    const accts = await this.db.select().from(accounts).where(eq(accounts.orgId, orgId));
    const txns = await this.db
      .select({
        id: transactions.id,
        orgId: transactions.orgId,
        accountId: transactions.accountId,
        name: transactions.name,
        amount: transactions.amount,
        date: transactions.date,
        merchantName: transactions.merchantName,
        pending: transactions.pending,
        categoryId: transactions.categoryId,
        plaidCategoryPrimary: transactions.plaidCategoryPrimary,
        plaidCategoryDetailed: transactions.plaidCategoryDetailed,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(eq(transactions.orgId, orgId))
      .limit(10000);
    const items = await this.db
      .select({
        id: plaidItems.id,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        lastSyncedAt: plaidItems.lastSyncedAt,
        createdAt: plaidItems.createdAt,
      })
      .from(plaidItems)
      .where(eq(plaidItems.orgId, orgId));
    const logs = await this.listAuditLogs(orgId, 1000);
    const docs = await this.db.select().from(documents).where(eq(documents.orgId, orgId));
    const orgGoals = await this.db.select().from(financialGoals).where(eq(financialGoals.orgId, orgId));
    const orgTags = await this.db.select().from(tags).where(eq(tags.orgId, orgId));
    const holdings = await this.db.select().from(investmentHoldings).where(eq(investmentHoldings.orgId, orgId)).limit(5000);
    const liabs = await this.db.select().from(liabilities).where(eq(liabilities.orgId, orgId)).limit(2000);
    const recurring = await this.db.select().from(recurringStreams).where(eq(recurringStreams.orgId, orgId));
    const recs = await this.db.select().from(recommendationItems).where(eq(recommendationItems.orgId, orgId)).limit(2000);
    const orgInsights = await this.db.select().from(insights).where(eq(insights.orgId, orgId)).limit(2000);
    const conversations = await this.db
      .select()
      .from(agentConversations)
      .where(eq(agentConversations.orgId, orgId))
      .limit(500);
    const archiveMeta = await this.db
      .select({
        id: plaidPayloadArchive.id,
        kind: plaidPayloadArchive.kind,
        plaidId: plaidPayloadArchive.plaidId,
        capturedAt: plaidPayloadArchive.capturedAt,
      })
      .from(plaidPayloadArchive)
      .where(eq(plaidPayloadArchive.orgId, orgId))
      .limit(5000);
    const consents = await this.db.select().from(orgConsents).where(eq(orgConsents.orgId, orgId));

    await this.db.insert(auditLogs).values({
      orgId,
      userId,
      action: 'data.export',
      entityType: 'organization',
      entityId: orgId,
      metadataJson: { format: 'gdpr-json-v2' },
    });

    return {
      exportedAt: new Date().toISOString(),
      format: 'gdpr-json-v2',
      catalog: DATA_CATALOG,
      organization: org,
      user: user
        ? { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
        : null,
      members,
      preferences: prefs,
      consents,
      plaidItems: items,
      accounts: accts,
      transactions: txns,
      holdings,
      liabilities: liabs,
      recurring,
      recommendations: recs,
      insights: orgInsights,
      agentConversations: conversations,
      documents: docs,
      goals: orgGoals,
      tags: orgTags,
      plaidArchiveMetadata: archiveMeta,
      auditLogs: logs,
    };
  }

  /** Soft-delete with grace period; hard purge via executeScheduledDeletion. */
  async deleteAccount(orgId: string, userId: string, opts: { immediate?: boolean } = {}) {
    const graceDays = Number(process.env.ACCOUNT_DELETION_GRACE_DAYS ?? 14);
    if (!opts.immediate && graceDays > 0) {
      const scheduled = new Date(Date.now() + graceDays * 24 * 60 * 60 * 1000);
      await this.db
        .update(organizations)
        .set({ status: 'pending_deletion', deletionScheduledAt: scheduled })
        .where(eq(organizations.id, orgId));
      await this.db.insert(auditLogs).values({
        orgId,
        userId,
        action: 'account.deletion_scheduled',
        entityType: 'organization',
        entityId: orgId,
        metadataJson: { deletionScheduledAt: scheduled.toISOString(), graceDays },
      });
      return {
        deleted: false,
        pendingDeletion: true,
        deletionScheduledAt: scheduled.toISOString(),
        plaidItemsRemoved: 0,
      };
    }
    return this.executeHardDelete(orgId, userId);
  }

  async executeHardDelete(orgId: string, userId: string) {
    const plaidResult = await this.plaid.removeAllPlaidItemsForOrg(orgId);

    const otherMemberships = await this.db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.userId, userId), ne(organizationMembers.orgId, orgId)));

    await this.db.delete(organizations).where(eq(organizations.id, orgId));

    if (otherMemberships.length === 0) {
      await this.db.delete(users).where(eq(users.id, userId));
    }

    return { deleted: true, pendingDeletion: false, plaidItemsRemoved: plaidResult.removed };
  }

  async cancelPendingDeletion(orgId: string, userId: string) {
    await this.db
      .update(organizations)
      .set({ status: 'active', deletionScheduledAt: null })
      .where(eq(organizations.id, orgId));
    await this.db.insert(auditLogs).values({
      orgId,
      userId,
      action: 'account.deletion_cancelled',
      entityType: 'organization',
      entityId: orgId,
      metadataJson: {},
    });
    return { cancelled: true };
  }
}

export { entities, equityGrants, lifePlans, scenarios, documents, taxProfiles, taxLots, tags, transactionTags, userPreferences, changeEvents, healthScores, agentMemories, agentRuns, agentConversations, notificationRules };
