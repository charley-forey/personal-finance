import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { organizations, users } from './identity';

export const platformRoleEnum = pgEnum('platform_role', [
  'platform_owner',
  'platform_admin',
  'support_agent',
  'billing_ops',
  'eng_ops',
  'security_compliance',
  'readonly_analyst',
]);

export const platformAdmins = pgTable(
  'platform_admins',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: platformRoleEnum('role').notNull().default('readonly_analyst'),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('platform_admins_email_idx').on(t.email),
    index('platform_admins_user_idx').on(t.userId),
  ],
);

export const adminAuditLogs = pgTable(
  'admin_audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorEmail: text('actor_email').notNull(),
    permission: text('permission'),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: text('entity_id'),
    targetOrgId: uuid('target_org_id').references(() => organizations.id, { onDelete: 'set null' }),
    reason: text('reason'),
    beforeJson: jsonb('before_json').$type<Record<string, unknown>>(),
    afterJson: jsonb('after_json').$type<Record<string, unknown>>(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>(),
    ip: text('ip'),
    requestId: text('request_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('admin_audit_actor_idx').on(t.actorEmail, t.createdAt),
    index('admin_audit_org_idx').on(t.targetOrgId, t.createdAt),
    index('admin_audit_action_idx').on(t.action, t.createdAt),
  ],
);

export const supportNotes = pgTable(
  'support_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
    authorEmail: text('author_email').notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('support_notes_org_idx').on(t.orgId, t.createdAt)],
);

export const supportCases = pgTable(
  'support_cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    subject: text('subject').notNull(),
    status: text('status').default('open').notNull(),
    priority: text('priority').default('normal').notNull(),
    playbookKey: text('playbook_key'),
    assigneeEmail: text('assignee_email'),
    createdByEmail: text('created_by_email').notNull(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  (t) => [
    index('support_cases_org_idx').on(t.orgId, t.status),
    index('support_cases_status_idx').on(t.status, t.updatedAt),
  ],
);

export const impersonationSessions = pgTable(
  'impersonation_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorEmail: text('actor_email').notNull(),
    targetOrgId: uuid('target_org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    targetUserId: uuid('target_user_id').references(() => users.id, { onDelete: 'set null' }),
    reason: text('reason').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
  },
  (t) => [
    index('impersonation_actor_idx').on(t.actorEmail, t.startedAt),
    index('impersonation_org_idx').on(t.targetOrgId, t.startedAt),
  ],
);

export const platformAlerts = pgTable(
  'platform_alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull(),
    severity: text('severity').default('warning').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    status: text('status').default('open').notNull(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (t) => [
    index('platform_alerts_status_idx').on(t.status, t.createdAt),
    index('platform_alerts_key_idx').on(t.key),
  ],
);

export const entitlementOverrides = pgTable(
  'entitlement_overrides',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    maxBanks: integer('max_banks'),
    maxAiMessagesMonthly: integer('max_ai_messages_monthly'),
    maxDocuments: integer('max_documents'),
    historyDays: integer('history_days'),
    reason: text('reason').notNull(),
    grantedByEmail: text('granted_by_email').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('entitlement_overrides_org_idx').on(t.orgId)],
);

export const platformMetricSnapshots = pgTable(
  'platform_metric_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    snapshotDate: text('snapshot_date').notNull(),
    metricsJson: jsonb('metrics_json').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('platform_metric_snapshots_date_idx').on(t.snapshotDate)],
);

export const dsarRequests = pgTable(
  'dsar_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    requestType: text('request_type').notNull(),
    status: text('status').default('pending').notNull(),
    requestedByEmail: text('requested_by_email').notNull(),
    approvedByEmail: text('approved_by_email'),
    reason: text('reason'),
    resultJson: jsonb('result_json').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [index('dsar_requests_status_idx').on(t.status, t.createdAt)],
);

export const complimentaryGrants = pgTable(
  'complimentary_grants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    planTier: text('plan_tier').notNull(),
    reason: text('reason').notNull(),
    grantedByEmail: text('granted_by_email').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('comp_grants_org_idx').on(t.orgId)],
);
