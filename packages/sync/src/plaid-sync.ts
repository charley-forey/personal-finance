import { eq, and, isNull, desc } from 'drizzle-orm';
import type { PlaidApi } from 'plaid';
import type { Database } from '@pf/database';
import {
  plaidItems,
  accounts,
  accountBalances,
  transactions,
  investmentSecurities,
  investmentHoldings,
  investmentTransactions,
  liabilities,
  recurringStreams,
  domainEvents,
  changeEvents,
  balanceDeltas,
} from '@pf/database';
import { EVENT_TYPES } from '@pf/events';
import { parseDecimal } from '@pf/shared';

export interface SyncResult {
  accountsSynced: number;
  transactionsAdded: number;
  transactionsModified: number;
  transactionsRemoved: number;
  holdingsSynced: number;
  liabilitiesSynced: number;
  recurringSynced: number;
}

export async function syncPlaidItem(
  db: Database,
  plaid: PlaidApi,
  itemDbId: string,
  orgId: string,
  accessToken: string,
  options?: { categorize?: (orgId: string, txnId: string) => Promise<void> },
): Promise<SyncResult> {
  const result: SyncResult = {
    accountsSynced: 0,
    transactionsAdded: 0,
    transactionsModified: 0,
    transactionsRemoved: 0,
    holdingsSynced: 0,
    liabilitiesSynced: 0,
    recurringSynced: 0,
  };

  const [item] = await db.select().from(plaidItems).where(eq(plaidItems.id, itemDbId));
  if (!item) return result;

  await db
    .update(plaidItems)
    .set({ syncStatus: 'syncing', loginRequired: false })
    .where(eq(plaidItems.id, itemDbId));

  const accountsResponse = await plaid.accountsGet({ access_token: accessToken });
  const accountIdMap = new Map<string, string>();

  for (const acct of accountsResponse.data.accounts) {
    const [existing] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.plaidAccountId, acct.account_id));

    let accountId: string;
    if (existing) {
      accountId = existing.id;
    } else {
      const [inserted] = await db
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
    accountIdMap.set(acct.account_id, accountId);
    result.accountsSynced++;

    const [prevBalance] = await db
      .select()
      .from(accountBalances)
      .where(eq(accountBalances.accountId, accountId))
      .orderBy(desc(accountBalances.capturedAt))
      .limit(1);

    const newBalance = acct.balances.current?.toString() ?? '0';
    await db.insert(accountBalances).values({
      accountId,
      available: acct.balances.available?.toString(),
      current: newBalance,
      limitAmount: acct.balances.limit?.toString(),
      isoCurrencyCode: acct.balances.iso_currency_code ?? 'USD',
    });

    const prev = parseDecimal(prevBalance?.current);
    const curr = parseDecimal(newBalance);
    if (prevBalance && Math.abs(curr - prev) > 0.01) {
      await db.insert(balanceDeltas).values({
        accountId,
        previousBalance: prev.toString(),
        newBalance: curr.toString(),
        deltaAmount: (curr - prev).toString(),
        deltaPct: prev !== 0 ? (((curr - prev) / prev) * 100).toFixed(4) : '0',
      });
      await db.insert(changeEvents).values({
        orgId,
        entityType: 'account',
        entityId: accountId,
        fieldName: 'balance',
        oldValueJson: { value: prev },
        newValueJson: { value: curr },
        changeSource: 'plaid_sync',
      });
      await db.insert(domainEvents).values({
        orgId,
        eventType: EVENT_TYPES.BALANCE_CHANGED,
        aggregateType: 'account',
        aggregateId: accountId,
        payloadJson: { previousBalance: prev, newBalance: curr },
      });
    }
  }

  let cursor = item.cursor ?? undefined;
  let hasMore = true;

  while (hasMore) {
    const syncResponse = await plaid.transactionsSync({
      access_token: accessToken,
      cursor,
    });

    for (const txn of syncResponse.data.added) {
      const accountId = accountIdMap.get(txn.account_id);
      if (!accountId) continue;

      const [inserted] = await db
        .insert(transactions)
        .values({
          orgId,
          accountId,
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
        .onConflictDoNothing()
        .returning();

      if (inserted && options?.categorize) {
        await options.categorize(orgId, inserted.id);
      }
      result.transactionsAdded++;
    }

    for (const txn of syncResponse.data.modified) {
      const accountId = accountIdMap.get(txn.account_id);
      if (!accountId) continue;

      await db
        .update(transactions)
        .set({
          amount: txn.amount.toString(),
          date: txn.date,
          authorizedDate: txn.authorized_date ?? undefined,
          name: txn.name,
          merchantName: txn.merchant_name ?? undefined,
          pending: txn.pending,
          plaidCategoryPrimary: txn.personal_finance_category?.primary,
          plaidCategoryDetailed: txn.personal_finance_category?.detailed,
          rawJson: txn as unknown as Record<string, unknown>,
          isDeleted: false,
          updatedAt: new Date(),
        })
        .where(
          and(eq(transactions.orgId, orgId), eq(transactions.plaidTransactionId, txn.transaction_id)),
        );
      result.transactionsModified++;
    }

    for (const removed of syncResponse.data.removed) {
      await db
        .update(transactions)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(
          and(eq(transactions.orgId, orgId), eq(transactions.plaidTransactionId, removed.transaction_id)),
        );
      result.transactionsRemoved++;
    }

    cursor = syncResponse.data.next_cursor;
    hasMore = syncResponse.data.has_more;
  }

  try {
    const holdingsResponse = await plaid.investmentsHoldingsGet({ access_token: accessToken });
    for (const security of holdingsResponse.data.securities) {
      let securityId: string | undefined;
      const [existingSec] = await db
        .select()
        .from(investmentSecurities)
        .where(eq(investmentSecurities.ticker, security.ticker_symbol ?? ''))
        .limit(1);

      if (existingSec) {
        securityId = existingSec.id;
      } else if (security.security_id) {
        const [inserted] = await db
          .insert(investmentSecurities)
          .values({
            ticker: security.ticker_symbol ?? undefined,
            name: security.name ?? undefined,
            type: security.type ?? undefined,
            cusip: security.cusip ?? undefined,
            isin: security.isin ?? undefined,
            closePrice: security.close_price?.toString(),
            closePriceAsOf: security.close_price_as_of ?? undefined,
          })
          .returning();
        securityId = inserted?.id;
      }

      const holding = holdingsResponse.data.holdings.find((h) => h.security_id === security.security_id);
      if (!holding) continue;

      const accountId = accountIdMap.get(holding.account_id);
      if (!accountId || !securityId) continue;

      await db.insert(investmentHoldings).values({
        orgId,
        accountId,
        securityId,
        quantity: holding.quantity?.toString(),
        costBasis: holding.cost_basis?.toString(),
        institutionPrice: holding.institution_price?.toString(),
        institutionValue: holding.institution_value?.toString(),
      });
      result.holdingsSynced++;
    }
  } catch {
    // Investments product may not be enabled
  }

  try {
    const liabilitiesResponse = await plaid.liabilitiesGet({ access_token: accessToken });
    const credit = liabilitiesResponse.data.liabilities.credit ?? [];
    for (const card of credit) {
      const accountId = accountIdMap.get(card.account_id ?? '');
      if (!accountId) continue;
      await db.insert(liabilities).values({
        orgId,
        accountId,
        liabilityType: 'credit',
        apr: card.aprs?.[0]?.apr_percentage?.toString(),
        minimumPayment: card.minimum_payment_amount?.toString(),
        lastPaymentAmount: card.last_payment_amount?.toString(),
        lastPaymentDate: card.last_payment_date ?? undefined,
        nextPaymentDue: card.next_payment_due_date ?? undefined,
      });
      result.liabilitiesSynced++;
    }
    const student = liabilitiesResponse.data.liabilities.student ?? [];
    for (const loan of student) {
      const accountId = accountIdMap.get(loan.account_id ?? '');
      if (!accountId) continue;
      await db.insert(liabilities).values({
        orgId,
        accountId,
        liabilityType: 'student',
        apr: loan.interest_rate_percentage?.toString(),
        minimumPayment: loan.minimum_payment_amount?.toString(),
        lastPaymentAmount: loan.last_payment_amount?.toString(),
        lastPaymentDate: loan.last_payment_date ?? undefined,
        nextPaymentDue: loan.next_payment_due_date ?? undefined,
      });
      result.liabilitiesSynced++;
    }
  } catch {
    // Liabilities product may not be enabled
  }

  try {
    const recurringResponse = await plaid.transactionsRecurringGet({ access_token: accessToken });
    const allStreams = [
      ...(recurringResponse.data.inflow_streams ?? []).map((s) => ({ ...s, direction: 'inflow' as const })),
      ...(recurringResponse.data.outflow_streams ?? []).map((s) => ({ ...s, direction: 'outflow' as const })),
    ];
    for (const stream of allStreams) {
      const accountId = stream.account_id ? accountIdMap.get(stream.account_id) : undefined;
      const [existing] = await db
        .select()
        .from(recurringStreams)
        .where(and(eq(recurringStreams.orgId, orgId), eq(recurringStreams.streamId, stream.stream_id)))
        .limit(1);

      if (existing) {
        await db
          .update(recurringStreams)
          .set({
            description: stream.description ?? undefined,
            frequency: stream.frequency ?? undefined,
            averageAmount: stream.average_amount?.amount?.toString(),
            lastAmount: stream.last_amount?.amount?.toString(),
            isActive: stream.is_active ?? true,
            lastDate: stream.last_date ?? undefined,
          })
          .where(eq(recurringStreams.id, existing.id));
      } else {
        await db.insert(recurringStreams).values({
          orgId,
          accountId,
          streamId: stream.stream_id,
          description: stream.description ?? undefined,
          frequency: stream.frequency ?? undefined,
          averageAmount: stream.average_amount?.amount?.toString(),
          lastAmount: stream.last_amount?.amount?.toString(),
          isActive: stream.is_active ?? true,
          firstDate: stream.first_date ?? undefined,
          lastDate: stream.last_date ?? undefined,
        });
      }
      result.recurringSynced++;
    }
  } catch {
    // Recurring may not be available
  }

  await db
    .update(plaidItems)
    .set({
      syncStatus: 'success',
      cursor,
      lastSyncedAt: new Date(),
      errorCode: null,
      loginRequired: false,
    })
    .where(eq(plaidItems.id, itemDbId));

  await db.insert(domainEvents).values({
    orgId,
    eventType: EVENT_TYPES.PLAID_SYNC_COMPLETED,
    aggregateType: 'plaid_item',
    aggregateId: itemDbId,
    payloadJson: result as unknown as Record<string, unknown>,
  });

  return result;
}

export async function processDomainEvents(db: Database, limit = 50) {
  const events = await db
    .select()
    .from(domainEvents)
    .where(isNull(domainEvents.processedAt))
    .limit(limit);

  for (const event of events) {
    await db
      .update(domainEvents)
      .set({ processedAt: new Date() })
      .where(eq(domainEvents.id, event.id));
  }

  return events.length;
}
