import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, gte, isNull } from 'drizzle-orm';
import { createPlaidClient, buildLinkTokenRequest } from '@pf/plaid-client';
import { syncPlaidItem, seedDefaultCategories, categorizeTransaction } from '@pf/sync';
import {
  organizations,
  users,
  organizationMembers,
  domainEvents,
  auditLogs,
  plaidWebhookEvents,
  platformAdmins,
  impersonationSessions,
  plaidItems,
} from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import type { AuthContext, MemberRole } from '@pf/shared';
import { isPlatformAdmin as isEnvPlatformAdmin } from '../common/env.util';
import { encryptToken, decryptToken, requireEncryptionKey } from '../common/crypto.util';
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
    // Default includes investments + liabilities so brokerage/retirement holdings sync.
    // Items created with transactions-only must be re-linked to gain products.
    const defaultProducts = ['transactions', 'investments', 'liabilities'] as const;
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
      return { linkToken: response.data.link_token, expiration: response.data.expiration, products };
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
    if (this.config.get('PLAID_SYNC_ENABLED') === 'false' || process.env.PLAID_SYNC_ENABLED === 'false') {
      throw new ForbiddenException('Plaid sync is disabled (PLAID_SYNC_ENABLED=false)');
    }

    const [item] = await this.db
      .select({ id: plaidItems.id, orgId: plaidItems.orgId })
      .from(plaidItems)
      .where(and(eq(plaidItems.id, itemDbId), eq(plaidItems.orgId, orgId)))
      .limit(1);

    if (!item) {
      throw new NotFoundException('Plaid item not found for this organization');
    }

    await this.db
      .update(plaidItems)
      .set({ syncStatus: 'pending', errorCode: null })
      .where(eq(plaidItems.id, itemDbId));

    await this.syncQueue.add(
      'sync',
      { itemId: itemDbId, orgId },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    );
    return { queued: true, itemId: itemDbId, syncStatus: 'pending' as const };
  }

  async syncItem(itemDbId: string, orgId: string) {
    const [item] = await this.db
      .select()
      .from(plaidItems)
      .where(and(eq(plaidItems.id, itemDbId), eq(plaidItems.orgId, orgId)))
      .limit(1);
    if (!item) return;

    const accessToken = decryptToken(item.accessTokenEncrypted, this.getEncryptionKey());

    return syncPlaidItem(this.db, this.plaid, itemDbId, orgId, accessToken, {
      categorize: (oid, txnId) => categorizeTransaction(this.db, oid, txnId),
    });
  }

  async removePlaidItem(
    itemDbId: string,
    orgId: string,
    opts: { wipeHistory?: boolean } = {},
  ): Promise<void> {
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

    if (opts.wipeHistory) {
      await this.db
        .delete(plaidItems)
        .where(and(eq(plaidItems.id, itemDbId), eq(plaidItems.orgId, orgId)));
      return;
    }

    // Keep historical accounts/transactions; revoke live access only.
    await this.db
      .update(plaidItems)
      .set({
        accessTokenEncrypted: 'revoked',
        syncStatus: 'error',
        errorCode: 'DISCONNECTED',
        loginRequired: false,
        syncWarnings: ['Disconnected by user — history retained'],
      })
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
  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
  ) {}

  async resolveContext(
    workosUserId: string,
    email: string,
    name?: string,
    workosOrgId?: string,
  ): Promise<AuthContext> {
    const resolvedEmail = await this.resolveEmail(workosUserId, email);
    const user = await this.ensureUser(workosUserId, resolvedEmail, name);
    const membership = await this.ensureMembership(user!, workosOrgId, name ?? resolvedEmail);

    await seedDefaultCategories(this.db, membership.orgId);

    return {
      userId: user!.id,
      workosUserId,
      email: user!.email || resolvedEmail,
      orgId: membership.orgId,
      role: membership.role,
    };
  }

  /** WorkOS access tokens often omit email — hydrate from DB or User Management API. */
  private async resolveEmail(workosUserId: string, tokenEmail: string): Promise<string> {
    const synthetic = !tokenEmail || tokenEmail.endsWith('@users.workos');
    if (!synthetic) return tokenEmail.toLowerCase();

    const [existing] = await this.db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.workosUserId, workosUserId))
      .limit(1);
    if (existing?.email && !existing.email.endsWith('@users.workos')) {
      return existing.email.toLowerCase();
    }

    const apiKey = this.config.get<string>('WORKOS_API_KEY');
    if (!apiKey) return tokenEmail.toLowerCase();

    try {
      const res = await fetch(`https://api.workos.com/user_management/users/${workosUserId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) return tokenEmail.toLowerCase();
      const body = (await res.json()) as { email?: string };
      if (body.email) return body.email.toLowerCase();
    } catch {
      // fall through
    }
    return tokenEmail.toLowerCase();
  }

  async ensureUser(workosUserId: string, email: string, name?: string) {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.workosUserId, workosUserId))
      .limit(1);

    if (existing) {
      const needsEmail =
        email &&
        !email.endsWith('@users.workos') &&
        (existing.email.endsWith('@users.workos') || existing.email.toLowerCase() !== email.toLowerCase());
      const needsName = Boolean(name && name !== existing.name);
      if (needsEmail || needsName) {
        const [updated] = await this.db
          .update(users)
          .set({
            ...(needsEmail ? { email: email.toLowerCase() } : {}),
            ...(needsName ? { name } : {}),
          })
          .where(eq(users.id, existing.id))
          .returning();
        return updated;
      }
      return existing;
    }

    const [user] = await this.db
      .insert(users)
      .values({ workosUserId, email: email.toLowerCase(), name })
      .returning();

    return user;
  }

  /**
   * Platform-admin support: override org scope when a valid impersonation session exists.
   * Header: X-Act-As-Org + optional X-Act-As-Session
   */
  async applyActAsOrg(
    auth: AuthContext,
    targetOrgId: string,
    sessionId?: string,
  ): Promise<AuthContext & { impersonatedBy?: string; impersonationSessionId?: string }> {
    const email = auth.email.toLowerCase();
    const [adminRow] = await this.db
      .select()
      .from(platformAdmins)
      .where(eq(platformAdmins.email, email))
      .limit(1);

    const isAdmin =
      (adminRow?.active && Boolean(adminRow.role)) || isEnvPlatformAdmin(email);
    if (!isAdmin) {
      throw new ForbiddenException('Act-as requires platform admin');
    }

    const now = new Date();
    const sessions = await this.db
      .select()
      .from(impersonationSessions)
      .where(
        and(
          eq(impersonationSessions.actorEmail, email),
          eq(impersonationSessions.targetOrgId, targetOrgId),
          isNull(impersonationSessions.revokedAt),
          gte(impersonationSessions.expiresAt, now),
        ),
      )
      .limit(20);

    const session = sessionId
      ? sessions.find((s) => s.id === sessionId)
      : sessions[0];

    if (!session) {
      throw new ForbiddenException('No active impersonation session for this org');
    }

    const [org] = await this.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.id, targetOrgId))
      .limit(1);
    if (!org) throw new ForbiddenException('Target org not found');

    return {
      ...auth,
      orgId: targetOrgId,
      role: 'viewer',
      impersonatedBy: email,
      impersonationSessionId: session.id,
    };
  }

  private async ensureMembership(
    user: { id: string; preferredOrgId?: string | null },
    workosOrgId?: string,
    label?: string,
  ): Promise<{ orgId: string; role: MemberRole }> {
    const memberships = await this.db
      .select({
        orgId: organizationMembers.orgId,
        role: organizationMembers.role,
        workosOrgId: organizations.workosOrgId,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizations.id, organizationMembers.orgId))
      .where(eq(organizationMembers.userId, user.id));

    if (memberships.length > 0) {
      if (workosOrgId) {
        const byWorkos = memberships.find((m) => m.workosOrgId === workosOrgId);
        if (byWorkos) return { orgId: byWorkos.orgId, role: byWorkos.role };
      }
      if (user.preferredOrgId) {
        const preferred = memberships.find((m) => m.orgId === user.preferredOrgId);
        if (preferred) return { orgId: preferred.orgId, role: preferred.role };
      }
      return { orgId: memberships[0]!.orgId, role: memberships[0]!.role };
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

    // Accept pending invites for this email
    const [u] = await this.db.select({ email: users.email }).from(users).where(eq(users.id, user.id)).limit(1);
    if (u?.email) {
      // handled in OrgMembersService.acceptPendingInvites on login path below
    }

    return { orgId, role: 'owner' };
  }

  async switchOrganization(userId: string, orgId: string): Promise<{ orgId: string; role: MemberRole }> {
    const [membership] = await this.db
      .select({ role: organizationMembers.role })
      .from(organizationMembers)
      .where(and(eq(organizationMembers.userId, userId), eq(organizationMembers.orgId, orgId)))
      .limit(1);
    if (!membership) throw new ForbiddenException('Not a member of this organization');
    await this.db.update(users).set({ preferredOrgId: orgId }).where(eq(users.id, userId));
    return { orgId, role: membership.role };
  }

  async listMemberships(userId: string, currentOrgId: string) {
    const rows = await this.db
      .select({
        orgId: organizations.id,
        orgName: organizations.name,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizations.id, organizationMembers.orgId))
      .where(eq(organizationMembers.userId, userId));
    return rows.map((r) => ({ ...r, isCurrent: r.orgId === currentOrgId }));
  }
}
