import { eq, and, desc, inArray } from 'drizzle-orm';
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
  plaidPayloadArchive,
} from '@pf/database';
import { EVENT_TYPES } from '@pf/events';
import { parseDecimal, deriveAccountPurpose } from '@pf/shared';
import { randomUUID } from 'crypto';

export interface SyncResult {
  accountsSynced: number;
  transactionsAdded: number;
  transactionsModified: number;
  transactionsRemoved: number;
  holdingsSynced: number;
  liabilitiesSynced: number;
  recurringSynced: number;
  investmentTransactionsSynced: number;
  warnings: string[];
  syncJobId: string;
}

async function archivePlaidPayload(
  db: Database,
  orgId: string,
  itemId: string,
  kind: string,
  plaidId: string | undefined,
  payload: Record<string, unknown>,
) {
  await db.insert(plaidPayloadArchive).values({
    orgId,
    itemId,
    kind,
    plaidId: plaidId ?? null,
    payload,
  });
}

async function upsertSecurity(
  db: Database,
  security: {
    security_id: string;
    ticker_symbol?: string | null;
    name?: string | null;
    type?: string | null;
    cusip?: string | null;
    isin?: string | null;
    close_price?: number | null;
    close_price_as_of?: string | null;
  },
): Promise<string | undefined> {
  if (!security.security_id) return undefined;

  const [existing] = await db
    .select()
    .from(investmentSecurities)
    .where(eq(investmentSecurities.plaidSecurityId, security.security_id))
    .limit(1);

  if (existing) {
    await db
      .update(investmentSecurities)
      .set({
        ticker: security.ticker_symbol ?? existing.ticker,
        name: security.name ?? existing.name,
        type: security.type ?? existing.type,
        cusip: security.cusip ?? existing.cusip,
        isin: security.isin ?? existing.isin,
        closePrice: security.close_price?.toString() ?? existing.closePrice,
        closePriceAsOf: security.close_price_as_of ?? existing.closePriceAsOf,
      })
      .where(eq(investmentSecurities.id, existing.id));
    return existing.id;
  }

  const [inserted] = await db
    .insert(investmentSecurities)
    .values({
      plaidSecurityId: security.security_id,
      ticker: security.ticker_symbol ?? undefined,
      name: security.name ?? undefined,
      type: security.type ?? undefined,
      cusip: security.cusip ?? undefined,
      isin: security.isin ?? undefined,
      closePrice: security.close_price?.toString(),
      closePriceAsOf: security.close_price_as_of ?? undefined,
    })
    .returning();
  return inserted?.id;
}

/** Latest holdings snapshot per (accountId, securityId) for an org. */
export async function getLatestHoldings(db: Database, orgId: string) {
  const rows = await db
    .select()
    .from(investmentHoldings)
    .where(eq(investmentHoldings.orgId, orgId))
    .orderBy(desc(investmentHoldings.capturedAt));

  const seen = new Set<string>();
  const latest: typeof rows = [];
  for (const row of rows) {
    const key = `${row.accountId}:${row.securityId ?? 'none'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest.push(row);
  }
  return latest;
}

/** Latest liability snapshot per account for an org. */
export async function getLatestLiabilities(db: Database, orgId: string) {
  const rows = await db
    .select()
    .from(liabilities)
    .where(eq(liabilities.orgId, orgId))
    .orderBy(desc(liabilities.capturedAt));

  const seen = new Set<string>();
  const latest: typeof rows = [];
  for (const row of rows) {
    const key = `${row.accountId}:${row.liabilityType ?? 'unknown'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest.push(row);
  }
  return latest;
}

export async function syncPlaidItem(
  db: Database,
  plaid: PlaidApi,
  itemDbId: string,
  orgId: string,
  accessToken: string,
  options?: { categorize?: (orgId: string, txnId: string) => Promise<void> },
): Promise<SyncResult> {
  const syncJobId = randomUUID();
  const result: SyncResult = {
    accountsSynced: 0,
    transactionsAdded: 0,
    transactionsModified: 0,
    transactionsRemoved: 0,
    holdingsSynced: 0,
    liabilitiesSynced: 0,
    recurringSynced: 0,
    investmentTransactionsSynced: 0,
    warnings: [],
    syncJobId,
  };

  const [item] = await db.select().from(plaidItems).where(eq(plaidItems.id, itemDbId));
  if (!item) return result;

  await db
    .update(plaidItems)
    .set({
      syncStatus: 'syncing',
      loginRequired: false,
      lastSyncJobId: syncJobId,
      syncWarnings: [],
    })
    .where(eq(plaidItems.id, itemDbId));

  try {
    const accountsResponse = await plaid.accountsGet({ access_token: accessToken });
    const accountIdMap = new Map<string, string>();
    const syncedAccountIds: string[] = [];

    for (const acct of accountsResponse.data.accounts) {
      const purpose = deriveAccountPurpose(acct.type, acct.subtype);
      const [existing] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.orgId, orgId), eq(accounts.plaidAccountId, acct.account_id)))
        .limit(1);

      let accountId: string;
      if (existing) {
        accountId = existing.id;
        await db
          .update(accounts)
          .set({
            name: acct.name,
            officialName: acct.official_name ?? undefined,
            type: acct.type,
            subtype: acct.subtype ?? undefined,
            mask: acct.mask ?? undefined,
            currency: acct.balances.iso_currency_code ?? existing.currency ?? 'USD',
            purpose: existing.purposeOverride ? existing.purpose : purpose,
          })
          .where(eq(accounts.id, existing.id));
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
            purpose,
            purposeOverride: false,
          })
          .returning();
        accountId = inserted!.id;
      }
      accountIdMap.set(acct.account_id, accountId);
      syncedAccountIds.push(accountId);
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
        syncJobId,
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
          payloadJson: { previousBalance: prev, newBalance: curr, syncJobId },
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

      await archivePlaidPayload(db, orgId, itemDbId, 'transactions_sync_page', cursor, {
        added: syncResponse.data.added.length,
        modified: syncResponse.data.modified.length,
        removed: syncResponse.data.removed.length,
        nextCursor: syncResponse.data.next_cursor,
        // Full page payloads for max-fidelity replay
        addedPayloads: syncResponse.data.added as unknown as Record<string, unknown>[],
        modifiedPayloads: syncResponse.data.modified as unknown as Record<string, unknown>[],
        removedPayloads: syncResponse.data.removed as unknown as Record<string, unknown>[],
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
      await archivePlaidPayload(db, orgId, itemDbId, 'investments_holdings', undefined, {
        holdings: holdingsResponse.data.holdings as unknown as Record<string, unknown>[],
        securities: holdingsResponse.data.securities as unknown as Record<string, unknown>[],
        accounts: holdingsResponse.data.accounts as unknown as Record<string, unknown>[],
      });
      const securityIdByPlaid = new Map<string, string>();

      for (const security of holdingsResponse.data.securities) {
        const id = await upsertSecurity(db, security);
        if (id && security.security_id) securityIdByPlaid.set(security.security_id, id);
      }

      if (syncedAccountIds.length > 0) {
        await db
          .delete(investmentHoldings)
          .where(
            and(eq(investmentHoldings.orgId, orgId), inArray(investmentHoldings.accountId, syncedAccountIds)),
          );
      }

      const capturedAt = new Date();
      for (const holding of holdingsResponse.data.holdings) {
        const accountId = accountIdMap.get(holding.account_id);
        const securityId = securityIdByPlaid.get(holding.security_id);
        if (!accountId || !securityId) continue;

        await db.insert(investmentHoldings).values({
          orgId,
          accountId,
          securityId,
          quantity: holding.quantity?.toString(),
          costBasis: holding.cost_basis?.toString(),
          institutionPrice: holding.institution_price?.toString(),
          institutionValue: holding.institution_value?.toString(),
          syncJobId,
          capturedAt,
        });
        result.holdingsSynced++;
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Investments holdings unavailable (product may not be enabled on this Item)';
      result.warnings.push(`investments: ${msg}`);
    }

    try {
      const endDate = new Date().toISOString().slice(0, 10);
      const start = new Date();
      start.setFullYear(start.getFullYear() - 2);
      const startDate = start.toISOString().slice(0, 10);

      const invTxnResponse = await plaid.investmentsTransactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });

      for (const security of invTxnResponse.data.securities ?? []) {
        await upsertSecurity(db, security);
      }

      const securityRows = await db.select().from(investmentSecurities);
      const secByPlaid = new Map(
        securityRows.filter((s) => s.plaidSecurityId).map((s) => [s.plaidSecurityId!, s.id]),
      );

      for (const txn of invTxnResponse.data.investment_transactions ?? []) {
        const accountId = accountIdMap.get(txn.account_id);
        if (!accountId) continue;
        const securityId = txn.security_id ? secByPlaid.get(txn.security_id) : undefined;

        await db
          .insert(investmentTransactions)
          .values({
            orgId,
            accountId,
            securityId,
            plaidInvestmentTransactionId: txn.investment_transaction_id,
            type: txn.type ?? undefined,
            subtype: txn.subtype ?? undefined,
            name: txn.name ?? undefined,
            amount: txn.amount?.toString(),
            quantity: txn.quantity?.toString(),
            price: txn.price?.toString(),
            date: txn.date,
            fees: txn.fees?.toString(),
            syncJobId,
          })
          .onConflictDoNothing({
            target: [investmentTransactions.orgId, investmentTransactions.plaidInvestmentTransactionId],
          });
        result.investmentTransactionsSynced++;
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Investment transactions unavailable (product may not be enabled)';
      result.warnings.push(`investment_transactions: ${msg}`);
    }

    try {
      const liabilitiesResponse = await plaid.liabilitiesGet({ access_token: accessToken });
      if (syncedAccountIds.length > 0) {
        await db
          .delete(liabilities)
          .where(and(eq(liabilities.orgId, orgId), inArray(liabilities.accountId, syncedAccountIds)));
      }

      const capturedAt = new Date();
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
          syncJobId,
          capturedAt,
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
          syncJobId,
          capturedAt,
        });
        result.liabilitiesSynced++;
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Liabilities unavailable (product may not be enabled on this Item)';
      result.warnings.push(`liabilities: ${msg}`);
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

        const prevAmount = existing ? parseDecimal(existing.lastAmount ?? existing.averageAmount) : 0;
        const newAmount = stream.last_amount?.amount ?? stream.average_amount?.amount ?? 0;

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

          if (prevAmount > 0 && newAmount > 0 && newAmount / prevAmount >= 1.1) {
            await db.insert(changeEvents).values({
              orgId,
              entityType: 'recurring_stream',
              entityId: existing.id,
              fieldName: 'amount',
              oldValueJson: { value: prevAmount },
              newValueJson: { value: newAmount },
              changeSource: 'plaid_sync',
            });
            result.warnings.push(
              `subscription_price_hike: ${stream.description ?? existing.description ?? 'stream'} ${prevAmount} → ${newAmount}`,
            );
          }
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Recurring streams unavailable';
      result.warnings.push(`recurring: ${msg}`);
    }

    await db
      .update(plaidItems)
      .set({
        syncStatus: 'success',
        cursor,
        lastSyncedAt: new Date(),
        errorCode: null,
        loginRequired: false,
        syncWarnings: result.warnings,
        lastSyncJobId: syncJobId,
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
  } catch (err) {
    const code =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { data?: { error_code?: string } } }).response?.data?.error_code ===
        'string'
        ? (err as { response: { data: { error_code: string } } }).response.data.error_code
        : err instanceof Error
          ? err.message.slice(0, 120)
          : 'SYNC_FAILED';

    await db
      .update(plaidItems)
      .set({
        syncStatus: 'error',
        errorCode: code,
        syncWarnings: result.warnings,
        lastSyncJobId: syncJobId,
      })
      .where(eq(plaidItems.id, itemDbId));

    throw err;
  }
}

export async function processDomainEvents(db: Database, limit = 50) {
  const { processPendingDomainEvents } = await import('@pf/data-pipeline');
  return processPendingDomainEvents(db, limit);
}
