import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  numeric,
  date,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations, syncStatusEnum } from './identity';

export const plaidItems = pgTable(
  'plaid_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    plaidItemId: text('plaid_item_id').notNull(),
    institutionId: text('institution_id'),
    institutionName: text('institution_name'),
    accessTokenEncrypted: text('access_token_encrypted').notNull(),
    cursor: text('cursor'),
    syncStatus: syncStatusEnum('sync_status').default('pending').notNull(),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    consentExpiresAt: timestamp('consent_expires_at', { withTimezone: true }),
    errorCode: text('error_code'),
    loginRequired: boolean('login_required').default(false).notNull(),
    webhookUrl: text('webhook_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('plaid_items_org_item_idx').on(t.orgId, t.plaidItemId),
    index('plaid_items_org_idx').on(t.orgId),
  ],
);

export const plaidWebhookEvents = pgTable('plaid_webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id').references(() => plaidItems.id, { onDelete: 'cascade' }),
  webhookType: text('webhook_type').notNull(),
  webhookCode: text('webhook_code').notNull(),
  payloadJson: jsonb('payload_json').$type<Record<string, unknown>>().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  status: text('status').default('pending').notNull(),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    itemId: uuid('item_id').references(() => plaidItems.id, { onDelete: 'cascade' }).notNull(),
    plaidAccountId: text('plaid_account_id').notNull(),
    name: text('name').notNull(),
    officialName: text('official_name'),
    type: text('type').notNull(),
    subtype: text('subtype'),
    mask: text('mask'),
    currency: text('currency').default('USD').notNull(),
    isHidden: boolean('is_hidden').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('accounts_org_plaid_idx').on(t.orgId, t.plaidAccountId),
    index('accounts_org_idx').on(t.orgId),
  ],
);

export const accountBalances = pgTable(
  'account_balances',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
    available: numeric('available', { precision: 18, scale: 2 }),
    current: numeric('current', { precision: 18, scale: 2 }),
    limitAmount: numeric('limit_amount', { precision: 18, scale: 2 }),
    isoCurrencyCode: text('iso_currency_code').default('USD'),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('balance_account_captured_idx').on(t.accountId, t.capturedAt)],
);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
    categoryId: uuid('category_id'),
    plaidTransactionId: text('plaid_transaction_id').notNull(),
    amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
    isoCurrencyCode: text('iso_currency_code').default('USD'),
    date: date('date').notNull(),
    authorizedDate: date('authorized_date'),
    name: text('name').notNull(),
    merchantName: text('merchant_name'),
    pending: boolean('pending').default(false).notNull(),
    paymentChannel: text('payment_channel'),
    plaidCategoryPrimary: text('plaid_category_primary'),
    plaidCategoryDetailed: text('plaid_category_detailed'),
    locationJson: jsonb('location_json').$type<Record<string, unknown>>(),
    notes: text('notes'),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    rawJson: jsonb('raw_json').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('txn_org_plaid_idx').on(t.orgId, t.plaidTransactionId),
    index('txn_org_date_idx').on(t.orgId, t.date),
    index('txn_org_account_idx').on(t.orgId, t.accountId, t.date),
  ],
);

export const investmentSecurities = pgTable('investment_securities', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticker: text('ticker'),
  name: text('name'),
  type: text('type'),
  cusip: text('cusip'),
  isin: text('isin'),
  closePrice: numeric('close_price', { precision: 18, scale: 4 }),
  closePriceAsOf: date('close_price_as_of'),
});

export const investmentHoldings = pgTable('investment_holdings', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  securityId: uuid('security_id').references(() => investmentSecurities.id),
  quantity: numeric('quantity', { precision: 18, scale: 6 }),
  costBasis: numeric('cost_basis', { precision: 18, scale: 2 }),
  institutionPrice: numeric('institution_price', { precision: 18, scale: 4 }),
  institutionValue: numeric('institution_value', { precision: 18, scale: 2 }),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
});

export const investmentTransactions = pgTable('investment_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  securityId: uuid('security_id').references(() => investmentSecurities.id),
  type: text('type'),
  amount: numeric('amount', { precision: 18, scale: 2 }),
  quantity: numeric('quantity', { precision: 18, scale: 6 }),
  date: date('date'),
  fees: numeric('fees', { precision: 18, scale: 2 }),
});

export const liabilities = pgTable('liabilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  liabilityType: text('liability_type'),
  apr: numeric('apr', { precision: 8, scale: 4 }),
  minimumPayment: numeric('minimum_payment', { precision: 18, scale: 2 }),
  lastPaymentAmount: numeric('last_payment_amount', { precision: 18, scale: 2 }),
  lastPaymentDate: date('last_payment_date'),
  nextPaymentDue: date('next_payment_due'),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
});

export const recurringStreams = pgTable('recurring_streams', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }),
  streamId: text('stream_id').notNull(),
  description: text('description'),
  frequency: text('frequency'),
  averageAmount: numeric('average_amount', { precision: 18, scale: 2 }),
  lastAmount: numeric('last_amount', { precision: 18, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  categoryId: uuid('category_id'),
  firstDate: date('first_date'),
  lastDate: date('last_date'),
});
