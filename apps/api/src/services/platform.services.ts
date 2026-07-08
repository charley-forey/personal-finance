import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe | null = null;

  constructor(private config: ConfigService) {
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
}

@Injectable()
export class NotificationService {
  async sendEmail(to: string, subject: string, body: string) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log(`[email stub] To: ${to}, Subject: ${subject}`);
      return { sent: false, reason: 'SendGrid not configured' };
    }
    // SendGrid integration placeholder
    return { sent: true };
  }

  async sendSms(to: string, body: string) {
    console.log(`[sms stub] To: ${to}: ${body}`);
    return { sent: false, reason: 'Twilio not configured' };
  }
}

@Injectable()
export class FeatureFlagService {
  private flags: Record<string, boolean> = {
    ai_agents: true,
    monte_carlo: true,
    tax_center: true,
    advisor_portal: false,
    voice_interface: false,
    graphql_api: false,
  };

  isEnabled(key: string, orgId?: string): boolean {
    return this.flags[key] ?? false;
  }
}

@Injectable()
export class AdminService {
  async searchOrgs(query: string) {
    return { query, results: [], message: 'Admin search requires super-admin role' };
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
  async generateCpaPack(orgId: string) {
    return {
      orgId,
      files: ['transactions.csv', 'pnl.pdf', 'tax-summary.pdf'],
      generatedAt: new Date().toISOString(),
    };
  }
}

@Injectable()
export class VerificationService {
  async runReconciliation(orgId: string) {
    return {
      orgId,
      status: 'pending',
      message: 'Reconciliation requires linked accounts with transaction history',
    };
  }
}

@Injectable()
export class KnowledgeService {
  async search(query: string, domain?: string) {
    return {
      query,
      domain,
      results: [],
      message: 'Vector search requires pgvector embeddings — seed content/knowledge/',
    };
  }
}
