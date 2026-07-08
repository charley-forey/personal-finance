import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, ne, desc, isNull, gte, sql } from 'drizzle-orm';
import Stripe from 'stripe';
import {
  subscriptions,
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
} from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { searchKnowledge, ingestKnowledgeBase } from '@pf/sync';
import { createOpenAIClient, generateEmbedding } from '@pf/ai';
import { resolve } from 'path';
import { createHash, randomBytes } from 'crypto';
import { PlaidService } from './core.services';

@Injectable()
export class BillingService {
  private stripe: Stripe | null = null;

  constructor(
    private config: ConfigService,
    @Inject(DATABASE) private db: Database,
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    if (key && !key.startsWith('sk_test_xxx')) {
      this.stripe = new Stripe(key);
    }
  }

  async createCheckoutSession(orgId: string, priceId: string) {
    if (!this.stripe) return { url: null, message: 'Stripe not configured' };
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('NEXT_PUBLIC_APP_URL')}/app/settings?billing=success`,
      cancel_url: `${this.config.get('NEXT_PUBLIC_APP_URL')}/pricing`,
      metadata: { orgId },
    });
    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    if (!this.stripe) return { received: false };
    const secret = this.config.get('STRIPE_WEBHOOK_SECRET');
    if (!secret) return { received: false, error: 'Webhook secret not configured' };

    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      if (orgId && session.subscription) {
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const sub = await this.stripe.subscriptions.retrieve(subId);
        const tier = this.mapPriceToTier(sub.items.data[0]?.price.id ?? '');

        await this.db.insert(subscriptions).values({
          orgId,
          stripeSubscriptionId: subId,
          planTier: tier,
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        });

        await this.db.update(organizations).set({ planTier: tier as 'free' }).where(eq(organizations.id, orgId));
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const [existing] = await this.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
        .limit(1);

      if (existing) {
        await this.db
          .update(subscriptions)
          .set({
            status: sub.status,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          })
          .where(eq(subscriptions.id, existing.id));
      }
    }

    return { received: true };
  }

  private mapPriceToTier(priceId: string): string {
    const pro = this.config.get('STRIPE_PRICE_PRO');
    const family = this.config.get('STRIPE_PRICE_FAMILY');
    const advisor = this.config.get('STRIPE_PRICE_ADVISOR');
    if (priceId === family) return 'family';
    if (priceId === advisor) return 'advisor';
    if (priceId === pro) return 'pro';
    return 'pro';
  }

  getPlanLimits(tier: string) {
    const limits: Record<string, { banks: number; aiChatsPerDay: number; historyDays: number }> = {
      free: { banks: 1, aiChatsPerDay: 1, historyDays: 30 },
      pro: { banks: 999, aiChatsPerDay: 999, historyDays: 9999 },
      family: { banks: 999, aiChatsPerDay: 999, historyDays: 9999 },
      advisor: { banks: 999, aiChatsPerDay: 999, historyDays: 9999 },
    };
    return limits[tier] ?? limits.free;
  }

  getMonthlyAiMessageLimit(tier: string): number | null {
    const limits = this.getPlanLimits(tier);
    if (limits.aiChatsPerDay >= 999) return null;
    return limits.aiChatsPerDay * 30;
  }

  async getOrgPlanTier(orgId: string): Promise<string> {
    const [org] = await this.db
      .select({ planTier: organizations.planTier })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);
    return org?.planTier ?? 'free';
  }

  async countBanks(orgId: string): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(plaidItems)
      .where(eq(plaidItems.orgId, orgId));
    return row?.count ?? 0;
  }

  async countAiMessagesThisMonth(orgId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [row] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(agentRuns)
      .innerJoin(agentConversations, eq(agentRuns.conversationId, agentConversations.id))
      .where(and(eq(agentConversations.orgId, orgId), gte(agentRuns.createdAt, startOfMonth)));
    return row?.count ?? 0;
  }

  async getPlanSummary(orgId: string) {
    const tier = await this.getOrgPlanTier(orgId);
    const limits = this.getPlanLimits(tier);
    const [bankCount, aiMessagesThisMonth] = await Promise.all([
      this.countBanks(orgId),
      this.countAiMessagesThisMonth(orgId),
    ]);
    return {
      tier,
      limits,
      aiMessagesLimit: this.getMonthlyAiMessageLimit(tier),
      usage: { banks: bankCount, aiMessagesThisMonth },
    };
  }

  async enforcePlanLimit(orgId: string, limitType: 'banks' | 'ai_messages'): Promise<void> {
    const tier = await this.getOrgPlanTier(orgId);
    const limits = this.getPlanLimits(tier);

    if (limitType === 'banks') {
      const count = await this.countBanks(orgId);
      if (count >= limits.banks) {
        throw new ForbiddenException(
          `Bank connection limit reached (${limits.banks} on ${tier} plan). Upgrade at /pricing.`,
        );
      }
    }

    if (limitType === 'ai_messages') {
      const monthlyLimit = this.getMonthlyAiMessageLimit(tier);
      if (monthlyLimit === null) return;
      const count = await this.countAiMessagesThisMonth(orgId);
      if (count >= monthlyLimit) {
        throw new ForbiddenException(
          `AI message limit reached for this month (${monthlyLimit} on ${tier} plan). Upgrade at /pricing.`,
        );
      }
    }
  }
}

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

  async createFirm(name: string) {
    const [firm] = await this.db.insert(advisorFirms).values({ name }).returning();
    return firm;
  }

  async linkClient(firmId: string, orgId: string, advisorUserId?: string) {
    const [client] = await this.db
      .insert(advisorClients)
      .values({ firmId, orgId, advisorUserId, status: 'active' })
      .returning();
    return client;
  }

  async listClients(firmId: string) {
    return this.db.select().from(advisorClients).where(eq(advisorClients.firmId, firmId));
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
  constructor(@Inject(DATABASE) private db: Database) {}

  async create(orgId: string, name: string, scopes: string[]) {
    const rawKey = `pf_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const [key] = await this.db
      .insert(apiKeys)
      .values({ orgId, name, keyHash, scopesJson: scopes })
      .returning();
    return { ...key, rawKey };
  }

  async list(orgId: string) {
    return this.db.select({ id: apiKeys.id, name: apiKeys.name, scopesJson: apiKeys.scopesJson, lastUsedAt: apiKeys.lastUsedAt }).from(apiKeys).where(eq(apiKeys.orgId, orgId));
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

  async exportOrgData(orgId: string, userId: string) {
    const [org] = await this.db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const members = await this.db.select().from(organizationMembers).where(eq(organizationMembers.orgId, orgId));
    const prefs = await this.db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    const accts = await this.db.select().from(accounts).where(eq(accounts.orgId, orgId));
    const txns = await this.db.select().from(transactions).where(eq(transactions.orgId, orgId)).limit(10000);
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

    return {
      exportedAt: new Date().toISOString(),
      format: 'gdpr-json-v1',
      organization: org,
      user: user
        ? { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
        : null,
      members,
      preferences: prefs,
      plaidItems: items,
      accounts: accts,
      transactions: txns,
      documents: docs,
      goals: orgGoals,
      tags: orgTags,
      auditLogs: logs,
    };
  }

  async deleteAccount(orgId: string, userId: string) {
    const plaidResult = await this.plaid.removeAllPlaidItemsForOrg(orgId);

    const otherMemberships = await this.db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.userId, userId), ne(organizationMembers.orgId, orgId)));

    await this.db.delete(organizations).where(eq(organizations.id, orgId));

    if (otherMemberships.length === 0) {
      await this.db.delete(users).where(eq(users.id, userId));
    }

    return { deleted: true, plaidItemsRemoved: plaidResult.removed };
  }
}

export { entities, equityGrants, lifePlans, scenarios, documents, taxProfiles, taxLots, tags, transactionTags, userPreferences, changeEvents, healthScores, agentMemories, agentRuns, agentConversations, notificationRules };
