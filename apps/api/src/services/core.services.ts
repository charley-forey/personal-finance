import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and } from 'drizzle-orm';
import { createPlaidClient, buildLinkTokenRequest } from '@pf/plaid-client';
import { syncPlaidItem, seedDefaultCategories, categorizeTransaction } from '@pf/sync';
import { organizations, users, organizationMembers, domainEvents, auditLogs, plaidWebhookEvents } from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import type { AuthContext, MemberRole } from '@pf/shared';
import { encryptToken, decryptToken, requireEncryptionKey } from '../common/crypto.util';
import { plaidItems } from '@pf/database';
import { EVENT_TYPES } from '@pf/events';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { decodeProtectedHeader, jwtVerify, importJWK } from 'jose';

const PLAID_SYNC_QUEUE = 'plaid-sync';

@Injectable()
export class PlaidService {
  private plaid;

  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
    @InjectQueue(PLAID_SYNC_QUEUE) private syncQueue: Queue,
  ) {
    this.plaid = createPlaidClient({
      clientId: this.config.get('PLAID_CLIENT_ID', ''),
      secret: this.config.get<string>('PLAID_SECRET') ?? this.config.get<string>('PLAID_SANDBOX_SECRET') ?? '',
      env: (this.config.get('PLAID_ENV', 'sandbox') as 'sandbox'),
      webhookUrl: this.config.get('PLAID_WEBHOOK_URL'),
    });
  }

  private getEncryptionKey(): string {
    return requireEncryptionKey(
      this.config.get('TOKEN_ENCRYPTION_KEY'),
      this.config.get('NODE_ENV', 'development'),
    );
  }

  async createLinkToken(userId: string, orgId: string) {
    const env = this.config.get('PLAID_ENV', 'sandbox');
    const productsEnv = this.config.get<string>('PLAID_PRODUCTS');
    const defaultProducts =
      env === 'production' ? (['transactions'] as const) : (['transactions', 'investments', 'liabilities'] as const);
    const products = productsEnv
      ? (productsEnv.split(',').map((p) => p.trim()) as Array<'transactions' | 'investments' | 'liabilities'>)
      : [...defaultProducts];

    const redirectUri = this.config.get('PLAID_REDIRECT_URI')?.trim();
    const safeRedirectUri =
      redirectUri && (env !== 'production' || redirectUri.startsWith('https://')) ? redirectUri : undefined;

    const request = buildLinkTokenRequest(userId, 'Personal Finance OS', {
      webhookUrl: this.config.get('PLAID_WEBHOOK_URL'),
      redirectUri: safeRedirectUri,
      products,
    });

    try {
      const response = await this.plaid.linkTokenCreate(request);
      return { linkToken: response.data.link_token, expiration: response.data.expiration };
    } catch (error: unknown) {
      const plaidError =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { error_message?: string } } }).response?.data?.error_message ===
          'string'
          ? (error as { response: { data: { error_message: string } } }).response.data.error_message
          : error instanceof Error
            ? error.message
            : 'Plaid link token request failed';

      throw new Error(plaidError);
    }
  }

  async exchangePublicToken(publicToken: string, orgId: string, userId?: string) {
    const exchange = await this.plaid.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = exchange.data.access_token;
    const itemId = exchange.data.item_id;

    const itemResponse = await this.plaid.itemGet({ access_token: accessToken });
    const institutionId = itemResponse.data.item.institution_id ?? undefined;

    let institutionName: string | undefined;
    if (institutionId) {
      try {
        const inst = await this.plaid.institutionsGetById({
          institution_id: institutionId,
          country_codes: ['US' as never],
        });
        institutionName = inst.data.institution.name;
      } catch {
        institutionName = institutionId;
      }
    }

    const encrypted = encryptToken(accessToken, this.getEncryptionKey());

    const [item] = await this.db
      .insert(plaidItems)
      .values({
        orgId,
        plaidItemId: itemId,
        institutionId,
        institutionName,
        accessTokenEncrypted: encrypted,
        syncStatus: 'pending',
      })
      .returning();

    await this.db.insert(domainEvents).values({
      orgId,
      eventType: EVENT_TYPES.PLAID_ITEM_LINKED,
      aggregateType: 'plaid_item',
      aggregateId: item!.id,
      payloadJson: { institutionName, itemId },
    });

    await this.db.insert(auditLogs).values({
      orgId,
      userId: userId ?? null,
      action: 'plaid.item.linked',
      entityType: 'plaid_item',
      entityId: item!.id,
      metadataJson: { institutionName },
    });

    await seedDefaultCategories(this.db, orgId);
    await this.enqueueSync(item!.id, orgId);
    return item;
  }

  async enqueueSync(itemDbId: string, orgId: string) {
    await this.syncQueue.add('sync', { itemId: itemDbId, orgId }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
    return { queued: true, itemId: itemDbId };
  }

  async syncItem(itemDbId: string, orgId: string) {
    const [item] = await this.db.select().from(plaidItems).where(eq(plaidItems.id, itemDbId));
    if (!item) return;

    const accessToken = decryptToken(item.accessTokenEncrypted, this.getEncryptionKey());

    return syncPlaidItem(this.db, this.plaid, itemDbId, orgId, accessToken, {
      categorize: (oid, txnId) => categorizeTransaction(this.db, oid, txnId),
    });
  }

  async removePlaidItem(itemDbId: string, orgId: string): Promise<void> {
    const [item] = await this.db
      .select()
      .from(plaidItems)
      .where(and(eq(plaidItems.id, itemDbId), eq(plaidItems.orgId, orgId)))
      .limit(1);
    if (!item) return;

    try {
      const accessToken = decryptToken(item.accessTokenEncrypted, this.getEncryptionKey());
      await this.plaid.itemRemove({ access_token: accessToken });
    } catch {
      // Item may already be removed at Plaid; continue with local deletion.
    }

    await this.db
      .delete(plaidItems)
      .where(and(eq(plaidItems.id, itemDbId), eq(plaidItems.orgId, orgId)));
  }

  async removeAllPlaidItemsForOrg(orgId: string): Promise<{ removed: number }> {
    const items = await this.db.select().from(plaidItems).where(eq(plaidItems.orgId, orgId));
    for (const item of items) {
      await this.removePlaidItem(item.id, orgId);
    }
    return { removed: items.length };
  }

  async verifyWebhookJwt(token: string, body: Record<string, unknown>): Promise<boolean> {
    try {
      const header = decodeProtectedHeader(token);
      const keyId = header.kid;
      if (!keyId) return false;

      const keyResponse = await this.plaid.webhookVerificationKeyGet({ key_id: keyId });
      const jwk = keyResponse.data.key as Parameters<typeof importJWK>[0];
      const key = await importJWK(jwk);
      const bodyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(body)));
      const bodyHashHex = Buffer.from(bodyHash).toString('hex');

      await jwtVerify(token, key, { maxTokenAge: '5 min' });
      const decoded = JSON.parse(Buffer.from(token.split('.')[1]!, 'base64url').toString());
      return decoded.request_body_sha256 === bodyHashHex;
    } catch {
      const env = this.config.get('PLAID_ENV', 'sandbox');
      const isProd = process.env.NODE_ENV === 'production' || env === 'production';
      if (isProd) return false;
      return env === 'sandbox' || env === 'development';
    }
  }

  async handleWebhook(body: Record<string, unknown>, verificationHeader?: string) {
    const env = this.config.get('PLAID_ENV', 'sandbox');
    const isProd = process.env.NODE_ENV === 'production' || env === 'production';

    if (isProd && !verificationHeader) {
      return { received: false, error: 'Missing webhook verification header' };
    }

    if (verificationHeader) {
      const valid = await this.verifyWebhookJwt(verificationHeader, body);
      if (!valid) return { received: false, error: 'Invalid webhook signature' };
    } else if (isProd) {
      return { received: false, error: 'Webhook verification required in production' };
    }

    const webhookType = body.webhook_type as string;
    const webhookCode = body.webhook_code as string;
    const itemId = body.item_id as string;

    const [item] = await this.db
      .select()
      .from(plaidItems)
      .where(eq(plaidItems.plaidItemId, itemId))
      .limit(1);

    const [event] = await this.db
      .insert(plaidWebhookEvents)
      .values({
        orgId: item?.orgId,
        itemId: item?.id,
        webhookType,
        webhookCode,
        payloadJson: body,
        status: 'pending',
      })
      .returning();

    if (!item) {
      await this.db
        .update(plaidWebhookEvents)
        .set({ status: 'ignored', processedAt: new Date() })
        .where(eq(plaidWebhookEvents.id, event!.id));
      return { received: true };
    }

    try {
      if (webhookCode === 'SYNC_UPDATES_AVAILABLE' || webhookCode === 'DEFAULT_UPDATE') {
        await this.enqueueSync(item.id, item.orgId);
      } else if (webhookCode === 'ITEM_LOGIN_REQUIRED' || webhookCode === 'PENDING_EXPIRATION') {
        await this.db
          .update(plaidItems)
          .set({ loginRequired: true, errorCode: webhookCode })
          .where(eq(plaidItems.id, item.id));
        await this.db.insert(auditLogs).values({
          orgId: item.orgId,
          action: 'plaid.item.reauth_required',
          entityType: 'plaid_item',
          entityId: item.id,
          metadataJson: { webhookCode },
        });
      }

      await this.db
        .update(plaidWebhookEvents)
        .set({ status: 'processed', processedAt: new Date() })
        .where(eq(plaidWebhookEvents.id, event!.id));
    } catch (err) {
      await this.db
        .update(plaidWebhookEvents)
        .set({
          status: 'error',
          error: err instanceof Error ? err.message : 'unknown',
          processedAt: new Date(),
        })
        .where(eq(plaidWebhookEvents.id, event!.id));
    }

    return { received: true, webhookType, webhookCode };
  }
}

@Injectable()
export class AuthService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async resolveContext(
    workosUserId: string,
    email: string,
    name?: string,
    workosOrgId?: string,
  ): Promise<AuthContext> {
    const user = await this.ensureUser(workosUserId, email, name);
    const membership = await this.ensureMembership(user!, workosOrgId, name ?? email);

    await seedDefaultCategories(this.db, membership.orgId);

    return {
      userId: user!.id,
      workosUserId,
      email,
      orgId: membership.orgId,
      role: membership.role,
    };
  }

  async ensureUser(workosUserId: string, email: string, name?: string) {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.workosUserId, workosUserId))
      .limit(1);

    if (existing) return existing;

    const [user] = await this.db
      .insert(users)
      .values({ workosUserId, email, name })
      .returning();

    return user;
  }

  private async ensureMembership(
    user: { id: string },
    workosOrgId?: string,
    label?: string,
  ): Promise<{ orgId: string; role: MemberRole }> {
    const [existingMembership] = await this.db
      .select({
        orgId: organizationMembers.orgId,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, user.id))
      .limit(1);

    if (existingMembership) {
      return {
        orgId: existingMembership.orgId,
        role: existingMembership.role,
      };
    }

    let orgId: string;
    if (workosOrgId) {
      const [existingOrg] = await this.db
        .select()
        .from(organizations)
        .where(eq(organizations.workosOrgId, workosOrgId))
        .limit(1);

      if (existingOrg) {
        orgId = existingOrg.id;
      } else {
        const [org] = await this.db
          .insert(organizations)
          .values({ name: `${label ?? 'Personal'} Organization`, workosOrgId })
          .returning();
        orgId = org!.id;
      }
    } else {
      const [org] = await this.db
        .insert(organizations)
        .values({ name: `${label ?? 'Personal'} Organization` })
        .returning();
      orgId = org!.id;
    }

    await this.db.insert(organizationMembers).values({
      orgId,
      userId: user.id,
      role: 'owner',
    });

    return { orgId, role: 'owner' };
  }
}
