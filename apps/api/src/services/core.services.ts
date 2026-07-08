import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { createPlaidClient, buildLinkTokenRequest } from '@pf/plaid-client';
import { organizations, users, organizationMembers, domainEvents } from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import { encryptToken, decryptToken } from '../common/crypto.util';
import { plaidItems, accounts, accountBalances, transactions } from '@pf/database';
import { EVENT_TYPES, createEvent } from '@pf/events';

@Injectable()
export class PlaidService {
  private plaid;

  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
  ) {
    this.plaid = createPlaidClient({
      clientId: this.config.get('PLAID_CLIENT_ID', ''),
      secret: this.config.get<string>('PLAID_SECRET') ?? this.config.get<string>('PLAID_SANDBOX_SECRET') ?? '',
      env: (this.config.get('PLAID_ENV', 'sandbox') as 'sandbox'),
      webhookUrl: this.config.get('PLAID_WEBHOOK_URL'),
    });
  }

  async createLinkToken(userId: string, orgId: string) {
    const request = buildLinkTokenRequest(
      userId,
      'Personal Finance OS',
      this.config.get('PLAID_WEBHOOK_URL'),
    );
    const response = await this.plaid.linkTokenCreate(request);
    return { linkToken: response.data.link_token, expiration: response.data.expiration };
  }

  async exchangePublicToken(publicToken: string, orgId: string) {
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

    const encryptionKey = this.config.get('TOKEN_ENCRYPTION_KEY', 'dev-key-change-in-production');
    const encrypted = encryptToken(accessToken, encryptionKey);

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

    await this.syncItem(item!.id, orgId);
    return item;
  }

  async syncItem(itemDbId: string, orgId: string) {
    const [item] = await this.db.select().from(plaidItems).where(eq(plaidItems.id, itemDbId));
    if (!item) return;

    const encryptionKey = this.config.get('TOKEN_ENCRYPTION_KEY', 'dev-key-change-in-production');
    const accessToken = decryptToken(item.accessTokenEncrypted, encryptionKey);

    await this.db.update(plaidItems).set({ syncStatus: 'syncing' }).where(eq(plaidItems.id, itemDbId));

    try {
      const accountsResponse = await this.plaid.accountsGet({ access_token: accessToken });

      for (const acct of accountsResponse.data.accounts) {
        const [existing] = await this.db
          .select()
          .from(accounts)
          .where(eq(accounts.plaidAccountId, acct.account_id));

        let accountId: string;
        if (existing) {
          accountId = existing.id;
        } else {
          const [inserted] = await this.db
            .insert(accounts)
            .values({
              orgId,
              itemId: itemDbId,
              plaidAccountId: acct.account_id,
              name: acct.name,
              officialName: acct.official_name ?? undefined,
              type: acct.type,
              subtype: acct.subtype ?? undefined,
              mask: acct.mask ?? undefined,
              currency: acct.balances.iso_currency_code ?? 'USD',
            })
            .returning();
          accountId = inserted!.id;
        }

        await this.db.insert(accountBalances).values({
          accountId,
          available: acct.balances.available?.toString(),
          current: acct.balances.current?.toString(),
          limitAmount: acct.balances.limit?.toString(),
          isoCurrencyCode: acct.balances.iso_currency_code ?? 'USD',
        });
      }

      let cursor = item.cursor ?? undefined;
      let hasMore = true;

      while (hasMore) {
        const syncResponse = await this.plaid.transactionsSync({
          access_token: accessToken,
          cursor,
        });

        for (const txn of syncResponse.data.added) {
          const account = await this.db
            .select()
            .from(accounts)
            .where(eq(accounts.plaidAccountId, txn.account_id))
            .limit(1);

          if (!account[0]) continue;

          await this.db
            .insert(transactions)
            .values({
              orgId,
              accountId: account[0].id,
              plaidTransactionId: txn.transaction_id,
              amount: txn.amount.toString(),
              isoCurrencyCode: txn.iso_currency_code ?? 'USD',
              date: txn.date,
              authorizedDate: txn.authorized_date ?? undefined,
              name: txn.name,
              merchantName: txn.merchant_name ?? undefined,
              pending: txn.pending,
              paymentChannel: txn.payment_channel ?? undefined,
              plaidCategoryPrimary: txn.personal_finance_category?.primary,
              plaidCategoryDetailed: txn.personal_finance_category?.detailed,
              locationJson: txn.location ? (txn.location as unknown as Record<string, unknown>) : undefined,
              rawJson: txn as unknown as Record<string, unknown>,
            })
            .onConflictDoNothing();
        }

        for (const txnId of syncResponse.data.removed) {
          // Mark removed transactions - in production would soft-delete
        }

        cursor = syncResponse.data.next_cursor;
        hasMore = syncResponse.data.has_more;
      }

      await this.db
        .update(plaidItems)
        .set({
          syncStatus: 'success',
          cursor,
          lastSyncedAt: new Date(),
          errorCode: null,
        })
        .where(eq(plaidItems.id, itemDbId));

      await this.db.insert(domainEvents).values({
        orgId,
        eventType: EVENT_TYPES.PLAID_SYNC_COMPLETED,
        aggregateType: 'plaid_item',
        aggregateId: itemDbId,
        payloadJson: { cursor },
      });
    } catch (error) {
      await this.db
        .update(plaidItems)
        .set({
          syncStatus: 'error',
          errorCode: error instanceof Error ? error.message : 'unknown',
        })
        .where(eq(plaidItems.id, itemDbId));
      throw error;
    }
  }

  async handleWebhook(body: Record<string, unknown>) {
    const webhookType = body.webhook_type as string;
    const webhookCode = body.webhook_code as string;
    const itemId = body.item_id as string;

    const [item] = await this.db
      .select()
      .from(plaidItems)
      .where(eq(plaidItems.plaidItemId, itemId))
      .limit(1);

    if (!item) return { received: true };

    if (webhookCode === 'SYNC_UPDATES_AVAILABLE' || webhookCode === 'DEFAULT_UPDATE') {
      await this.syncItem(item.id, item.orgId);
    }

    return { received: true, webhookType, webhookCode };
  }
}

@Injectable()
export class AuthService {
  constructor(@Inject(DATABASE) private db: Database) {}

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

    const [org] = await this.db
      .insert(organizations)
      .values({ name: `${name ?? email}'s Organization`, workosOrgId: workosUserId })
      .returning();

    await this.db.insert(organizationMembers).values({
      orgId: org!.id,
      userId: user!.id,
      role: 'owner',
    });

    return user;
  }
}
