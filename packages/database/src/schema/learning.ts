import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  numeric,
  boolean,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations, users } from './identity';
import { insights, forecasts } from './analytics';
import { transactions } from './financial';

export const financialProfiles = pgTable(
  'financial_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    lifeStage: text('life_stage'),
    riskTolerance: text('risk_tolerance'),
    filingStatus: text('filing_status'),
    dependents: integer('dependents').default(0),
    annualIncome: numeric('annual_income', { precision: 18, scale: 2 }),
    stateCode: text('state_code'),
    goalsSummary: text('goals_summary'),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('financial_profile_org_user_idx').on(t.orgId, t.userId)],
);

export const userSignals = pgTable(
  'user_signals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    signalType: text('signal_type').notNull(),
    entityType: text('entity_type'),
    entityId: text('entity_id'),
    payloadJson: jsonb('payload_json').$type<Record<string, unknown>>().default({}),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('user_signals_org_type_idx').on(t.orgId, t.signalType, t.occurredAt)],
);

export const categorizationCorrections = pgTable(
  'categorization_corrections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    transactionId: uuid('transaction_id').references(() => transactions.id, { onDelete: 'cascade' }).notNull(),
    priorCategoryId: uuid('prior_category_id'),
    newCategoryId: uuid('new_category_id').notNull(),
    merchantName: text('merchant_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('cat_corrections_org_idx').on(t.orgId, t.createdAt)],
);

export const insightFeedback = pgTable(
  'insight_feedback',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    insightId: uuid('insight_id').references(() => insights.id, { onDelete: 'cascade' }).notNull(),
    helpful: boolean('helpful'),
    actedOn: boolean('acted_on').default(false),
    dismissed: boolean('dismissed').default(false),
    reason: text('reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('insight_feedback_org_idx').on(t.orgId, t.insightId)],
);

export const recommendationItems = pgTable(
  'recommendation_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    body: text('body'),
    actionType: text('action_type').notNull(),
    priorityScore: numeric('priority_score', { precision: 8, scale: 4 }),
    confidence: numeric('confidence', { precision: 4, scale: 2 }),
    status: text('status').default('pending').notNull(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('recommendation_org_status_idx').on(t.orgId, t.status, t.priorityScore)],
);

export const recommendationOutcomes = pgTable(
  'recommendation_outcomes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    recommendationId: uuid('recommendation_id')
      .references(() => recommendationItems.id, { onDelete: 'cascade' })
      .notNull(),
    outcome: text('outcome').notNull(),
    notes: text('notes'),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('recommendation_outcomes_org_idx').on(t.orgId, t.recordedAt)],
);

export const forecastRuns = pgTable(
  'forecast_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    forecastId: uuid('forecast_id').references(() => forecasts.id, { onDelete: 'set null' }),
    modelType: text('model_type').notNull(),
    horizonDays: integer('horizon_days').notNull(),
    inputsJson: jsonb('inputs_json').$type<Record<string, unknown>>().notNull(),
    outputsJson: jsonb('outputs_json').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('forecast_runs_org_idx').on(t.orgId, t.createdAt)],
);

export const forecastAccuracy = pgTable(
  'forecast_accuracy',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    forecastRunId: uuid('forecast_run_id')
      .references(() => forecastRuns.id, { onDelete: 'cascade' })
      .notNull(),
    metric: text('metric').notNull(),
    predicted: numeric('predicted', { precision: 18, scale: 4 }),
    actual: numeric('actual', { precision: 18, scale: 4 }),
    errorPct: numeric('error_pct', { precision: 8, scale: 4 }),
    evaluatedAt: timestamp('evaluated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('forecast_accuracy_org_idx').on(t.orgId, t.evaluatedAt)],
);

export const promptVersions = pgTable(
  'prompt_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agentType: text('agent_type').notNull(),
    version: text('version').notNull(),
    contentHash: text('content_hash').notNull(),
    content: text('content').notNull(),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('prompt_versions_agent_version_idx').on(t.agentType, t.version)],
);

export const modelEvaluations = pgTable(
  'model_evaluations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
    agentType: text('agent_type'),
    promptVersionId: uuid('prompt_version_id').references(() => promptVersions.id, { onDelete: 'set null' }),
    score: numeric('score', { precision: 6, scale: 4 }),
    metricsJson: jsonb('metrics_json').$type<Record<string, unknown>>().default({}),
    evaluatedAt: timestamp('evaluated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('model_evaluations_agent_idx').on(t.agentType, t.evaluatedAt)],
);

export const journeyProgress = pgTable(
  'journey_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    hubId: text('hub_id').notNull(),
    stepId: text('step_id').notNull(),
    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('journey_progress_org_user_hub_step_idx').on(t.orgId, t.userId, t.hubId, t.stepId),
    index('journey_progress_org_hub_idx').on(t.orgId, t.hubId),
  ],
);

export const narrativeCache = pgTable(
  'narrative_cache',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    cacheKey: text('cache_key').notNull(),
    content: text('content').notNull(),
    metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('narrative_cache_org_key_idx').on(t.orgId, t.cacheKey)],
);
