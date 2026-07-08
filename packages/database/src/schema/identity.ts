import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  numeric,
  date,
  integer,
  uniqueIndex,
  index,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const planTierEnum = pgEnum('plan_tier', ['free', 'pro', 'family', 'advisor']);
export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'viewer']);
export const syncStatusEnum = pgEnum('sync_status', ['pending', 'syncing', 'success', 'error']);
export const pnlPeriodStatusEnum = pgEnum('pnl_period_status', ['draft', 'closed']);
export const insightTypeEnum = pgEnum('insight_type', ['anomaly', 'opportunity', 'trend', 'tax', 'warning']);
export const notificationChannelEnum = pgEnum('notification_channel', ['in_app', 'email', 'sms']);
export const goalTypeEnum = pgEnum('goal_type', ['emergency_fund', 'retirement', 'house', 'custom']);
export const scenarioTypeEnum = pgEnum('scenario_type', ['retirement', 'monte_carlo', 'what_if']);
export const documentTypeEnum = pgEnum('document_type', ['w2', '1099', 'statement', 'receipt', 'tax_return', 'other']);
export const entityTypeEnum = pgEnum('entity_type', ['personal', 'sole_prop', 'llc', 's_corp']);
export const grantTypeEnum = pgEnum('grant_type', ['rsu', 'iso', 'nso', 'espp']);
export const lifePlanTypeEnum = pgEnum('life_plan_type', ['home', 'college', 'wedding', 'car', 'sabbatical', 'custom']);
export const agentTypeEnum = pgEnum('agent_type', ['tax_advisor', 'retirement_planner', 'budget_coach', 'investment_analyst', 'general_cfo']);

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  workosOrgId: text('workos_org_id').unique(),
  name: text('name').notNull(),
  planTier: planTierEnum('plan_tier').default('free').notNull(),
  settingsJson: jsonb('settings_json').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  workosUserId: text('workos_user_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const organizationMembers = pgTable(
  'organization_members',
  {
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: memberRoleEnum('role').default('viewer').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.userId] })],
);

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currency: text('currency').default('USD').notNull(),
  timezone: text('timezone').default('America/New_York').notNull(),
  notificationSettingsJson: jsonb('notification_settings_json').$type<Record<string, unknown>>().default({}),
});

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: text('entity_id'),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>(),
    ip: text('ip'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('audit_org_created_idx').on(t.orgId, t.createdAt)],
);

export const domainEvents = pgTable(
  'domain_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    eventType: text('event_type').notNull(),
    aggregateType: text('aggregate_type').notNull(),
    aggregateId: text('aggregate_id').notNull(),
    payloadJson: jsonb('payload_json').$type<Record<string, unknown>>().notNull(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
  },
  (t) => [index('events_org_type_idx').on(t.orgId, t.eventType, t.occurredAt)],
);

export const households = pgTable('households', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
