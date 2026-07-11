import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, gte, sql } from 'drizzle-orm';
import Stripe from 'stripe';
import {
  subscriptions,
  organizations,
  plaidItems,
  agentRuns,
  agentConversations,
  documents,
} from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';

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
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;
        const sub = await this.stripe.subscriptions.retrieve(subId);
        const tier = this.mapPriceToTier(sub.items.data[0]?.price.id ?? '');

        await this.db.insert(subscriptions).values({
          orgId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subId,
          planTier: tier,
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        });

        await this.db
          .update(organizations)
          .set({
            planTier: tier as 'free' | 'pro' | 'family' | 'advisor',
            ...(customerId ? { stripeCustomerId: customerId } : {}),
          })
          .where(eq(organizations.id, orgId));
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
        const isDeleted = event.type === 'customer.subscription.deleted';
        await this.db
          .update(subscriptions)
          .set({
            status: isDeleted ? 'canceled' : sub.status,
            planTier: isDeleted ? 'free' : existing.planTier,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          })
          .where(eq(subscriptions.id, existing.id));

        if (isDeleted) {
          await this.db
            .update(organizations)
            .set({ planTier: 'free' })
            .where(eq(organizations.id, existing.orgId));
        }
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
    const limits: Record<string, { banks: number; aiChatsPerDay: number; historyDays: number; documents: number }> = {
      free: { banks: 1, aiChatsPerDay: 1, historyDays: 30, documents: 5 },
      pro: { banks: 999, aiChatsPerDay: 999, historyDays: 9999, documents: 999 },
      family: { banks: 999, aiChatsPerDay: 999, historyDays: 9999, documents: 999 },
      advisor: { banks: 999, aiChatsPerDay: 999, historyDays: 9999, documents: 999 },
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

  async countDocuments(orgId: string): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(documents)
      .where(eq(documents.orgId, orgId));
    return row?.count ?? 0;
  }

  async getPlanSummary(orgId: string) {
    const tier = await this.getOrgPlanTier(orgId);
    const limits = this.getPlanLimits(tier);
    const [bankCount, aiMessagesThisMonth, documentCount] = await Promise.all([
      this.countBanks(orgId),
      this.countAiMessagesThisMonth(orgId),
      this.countDocuments(orgId),
    ]);
    return {
      orgId,
      tier,
      limits,
      aiMessagesLimit: this.getMonthlyAiMessageLimit(tier),
      usage: { banks: bankCount, aiMessagesThisMonth, documents: documentCount },
    };
  }

  async enforcePlanLimit(
    orgId: string,
    limitType: 'banks' | 'ai_messages' | 'documents' | 'history_days',
    context?: { requestedDays?: number },
  ): Promise<void> {
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

    if (limitType === 'documents') {
      const count = await this.countDocuments(orgId);
      if (count >= limits.documents) {
        throw new ForbiddenException(
          `Document limit reached (${limits.documents} on ${tier} plan). Upgrade at /pricing.`,
        );
      }
    }

    if (limitType === 'history_days') {
      const requestedDays = context?.requestedDays;
      if (requestedDays !== undefined && requestedDays > limits.historyDays) {
        throw new ForbiddenException(
          `History limit exceeded (${limits.historyDays} days on ${tier} plan). Upgrade at /pricing.`,
        );
      }
    }
  }
}
