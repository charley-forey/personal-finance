import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  numeric,
  date,
  integer,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import {
  organizations,
  users,
  pnlPeriodStatusEnum,
  insightTypeEnum,
  notificationChannelEnum,
  goalTypeEnum,
  scenarioTypeEnum,
  documentTypeEnum,
  entityTypeEnum,
  grantTypeEnum,
  lifePlanTypeEnum,
  agentTypeEnum,
} from './identity';

export const dailyOrgSnapshots = pgTable(
  'daily_org_snapshots',
  {
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    snapshotDate: date('snapshot_date').notNull(),
    totalAssets: numeric('total_assets', { precision: 18, scale: 2 }),
    totalLiabilities: numeric('total_liabilities', { precision: 18, scale: 2 }),
    netWorth: numeric('net_worth', { precision: 18, scale: 2 }),
    cash: numeric('cash', { precision: 18, scale: 2 }),
    investments: numeric('investments', { precision: 18, scale: 2 }),
    creditDebt: numeric('credit_debt', { precision: 18, scale: 2 }),
    incomeMtd: numeric('income_mtd', { precision: 18, scale: 2 }),
    expensesMtd: numeric('expenses_mtd', { precision: 18, scale: 2 }),
    savingsMtd: numeric('savings_mtd', { precision: 18, scale: 2 }),
    computedAt: timestamp('computed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('daily_org_date_idx').on(t.orgId, t.snapshotDate)],
);

export const changeEvents = pgTable(
  'change_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    fieldName: text('field_name'),
    oldValueJson: jsonb('old_value_json'),
    newValueJson: jsonb('new_value_json'),
    changeSource: text('change_source').notNull(),
    detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('change_org_detected_idx').on(t.orgId, t.detectedAt)],
);

export const balanceDeltas = pgTable('balance_deltas', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull(),
  previousBalance: numeric('previous_balance', { precision: 18, scale: 2 }),
  newBalance: numeric('new_balance', { precision: 18, scale: 2 }),
  deltaAmount: numeric('delta_amount', { precision: 18, scale: 2 }),
  deltaPct: numeric('delta_pct', { precision: 8, scale: 4 }),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
});

export const categoryGroups = pgTable('category_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  groupId: uuid('group_id').references(() => categoryGroups.id),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  pnlRowKey: text('pnl_row_key'),
  plaidCategoryMapJson: jsonb('plaid_category_map_json').$type<string[]>(),
});

export const categoryRules = pgTable('category_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  matchType: text('match_type').notNull(),
  pattern: text('pattern').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  priority: integer('priority').default(0).notNull(),
});

export const pnlTemplates = pgTable('pnl_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  structureJson: jsonb('structure_json').$type<{ rows: string[]; columns: string[] }>().notNull(),
});

export const pnlPeriods = pgTable(
  'pnl_periods',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    templateId: uuid('template_id').references(() => pnlTemplates.id),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    status: pnlPeriodStatusEnum('status').default('draft').notNull(),
  },
  (t) => [uniqueIndex('pnl_org_period_idx').on(t.orgId, t.year, t.month)],
);

export const pnlCells = pgTable('pnl_cells', {
  id: uuid('id').primaryKey().defaultRandom(),
  periodId: uuid('period_id').references(() => pnlPeriods.id, { onDelete: 'cascade' }).notNull(),
  rowKey: text('row_key').notNull(),
  columnKey: text('column_key').notNull(),
  value: numeric('value', { precision: 18, scale: 2 }),
  source: text('source').default('manual').notNull(),
  formulaJson: jsonb('formula_json'),
  notes: text('notes'),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  rollover: boolean('rollover').default(false).notNull(),
});

export const budgetActuals = pgTable('budget_actuals', {
  id: uuid('id').primaryKey().defaultRandom(),
  budgetId: uuid('budget_id').references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  spent: numeric('spent', { precision: 18, scale: 2 }),
  remaining: numeric('remaining', { precision: 18, scale: 2 }),
  computedAt: timestamp('computed_at', { withTimezone: true }).defaultNow().notNull(),
});

export const financialGoals = pgTable('financial_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  goalType: goalTypeEnum('goal_type').default('custom').notNull(),
  targetAmount: numeric('target_amount', { precision: 18, scale: 2 }),
  targetDate: date('target_date'),
  currentAmount: numeric('current_amount', { precision: 18, scale: 2 }),
  assumptionsJson: jsonb('assumptions_json').$type<Record<string, unknown>>(),
});

export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  scenarioType: scenarioTypeEnum('scenario_type').notNull(),
  inputsJson: jsonb('inputs_json').$type<Record<string, unknown>>().notNull(),
  resultsJson: jsonb('results_json').$type<Record<string, unknown>>(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const forecasts = pgTable('forecasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  forecastType: text('forecast_type').notNull(),
  horizonMonths: integer('horizon_months').notNull(),
  assumptionsJson: jsonb('assumptions_json').$type<Record<string, unknown>>(),
  seriesJson: jsonb('series_json').$type<Record<string, unknown>>(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const insights = pgTable('insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  insightType: insightTypeEnum('insight_type').notNull(),
  severity: text('severity').default('info').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  dataJson: jsonb('data_json').$type<Record<string, unknown>>(),
  aiModel: text('ai_model'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
  dismissedAt: timestamp('dismissed_at', { withTimezone: true }),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  channel: notificationChannelEnum('channel').default('in_app').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
});

export const notificationRules = pgTable('notification_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  ruleType: text('rule_type').notNull(),
  conditionsJson: jsonb('conditions_json').$type<Record<string, unknown>>(),
  channelsJson: jsonb('channels_json').$type<string[]>(),
  enabled: boolean('enabled').default(true).notNull(),
});

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  verificationType: text('verification_type').notNull(),
  status: text('status').default('pending').notNull(),
  expectedJson: jsonb('expected_json'),
  actualJson: jsonb('actual_json'),
  variance: numeric('variance', { precision: 18, scale: 2 }),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

export const knowledgeDocuments = pgTable('knowledge_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  scope: text('scope').default('global').notNull(),
  domain: text('domain').notNull(),
  title: text('title').notNull(),
  contentMd: text('content_md').notNull(),
  sourceUrl: text('source_url'),
  effectiveYear: integer('effective_year'),
  tagsJson: jsonb('tags_json').$type<string[]>(),
});

export const knowledgeChunks = pgTable('knowledge_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => knowledgeDocuments.id, { onDelete: 'cascade' }).notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embedding: text('embedding'),
  metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>(),
});

export const agentConversations = pgTable('agent_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  agentType: agentTypeEnum('agent_type').notNull(),
  messagesJson: jsonb('messages_json').$type<Array<{ role: string; content: string }>>().default([]),
  contextEntityIdsJson: jsonb('context_entity_ids_json').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => agentConversations.id, { onDelete: 'cascade' }).notNull(),
  toolCallsJson: jsonb('tool_calls_json'),
  tokensUsed: integer('tokens_used'),
  latencyMs: integer('latency_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const manualAssets = pgTable('manual_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  assetType: text('asset_type').notNull(),
  name: text('name').notNull(),
  currentValue: numeric('current_value', { precision: 18, scale: 2 }),
  acquisitionValue: numeric('acquisition_value', { precision: 18, scale: 2 }),
  acquisitionDate: date('acquisition_date'),
  valuationMethod: text('valuation_method'),
  metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  taxYear: integer('tax_year'),
  filename: text('filename').notNull(),
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  parsedStatus: text('parsed_status').default('pending'),
  extractedDataJson: jsonb('extracted_data_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const taxProfiles = pgTable('tax_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  filingStatus: text('filing_status'),
  state: text('state'),
  dependents: integer('dependents').default(0),
  estimatedAnnualIncome: numeric('estimated_annual_income', { precision: 18, scale: 2 }),
  withholdingYtd: numeric('withholding_ytd', { precision: 18, scale: 2 }),
  deductionStrategy: text('deduction_strategy'),
});

export const taxLots = pgTable('tax_lots', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  securityId: uuid('security_id'),
  quantity: numeric('quantity', { precision: 18, scale: 6 }),
  costBasis: numeric('cost_basis', { precision: 18, scale: 2 }),
  acquiredDate: date('acquired_date'),
  disposalDate: date('disposal_date'),
  proceeds: numeric('proceeds', { precision: 18, scale: 2 }),
  gainLoss: numeric('gain_loss', { precision: 18, scale: 2 }),
  term: text('term'),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  color: text('color'),
});

export const transactionTags = pgTable('transaction_tags', {
  transactionId: uuid('transaction_id').notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
});

export const automationRules = pgTable('automation_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  priority: integer('priority').default(0),
  triggerType: text('trigger_type').notNull(),
  triggerConditionsJson: jsonb('trigger_conditions_json').$type<Record<string, unknown>>(),
  actionType: text('action_type').notNull(),
  actionConfigJson: jsonb('action_config_json').$type<Record<string, unknown>>(),
  lastTriggeredAt: timestamp('last_triggered_at', { withTimezone: true }),
  triggerCount: integer('trigger_count').default(0),
});

export const healthScores = pgTable('health_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  overallScore: integer('overall_score').notNull(),
  subScoresJson: jsonb('sub_scores_json').$type<Record<string, number>>(),
  improvementActionsJson: jsonb('improvement_actions_json').$type<Array<{ action: string; impact: number }>>(),
  computedAt: timestamp('computed_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  planTier: text('plan_tier').notNull(),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),
  scopesJson: jsonb('scopes_json').$type<string[]>(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

export const entities = pgTable('entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  entityType: entityTypeEnum('entity_type').notNull(),
  name: text('name').notNull(),
  ein: text('ein'),
  taxYearStart: date('tax_year_start'),
});

export const equityGrants = pgTable('equity_grants', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  grantType: grantTypeEnum('grant_type').notNull(),
  companyName: text('company_name').notNull(),
  ticker: text('ticker'),
  grantDate: date('grant_date'),
  vestingScheduleJson: jsonb('vesting_schedule_json').$type<Record<string, unknown>>(),
  totalShares: numeric('total_shares', { precision: 18, scale: 4 }),
  vestedShares: numeric('vested_shares', { precision: 18, scale: 4 }),
  strikePrice: numeric('strike_price', { precision: 18, scale: 4 }),
  currentFmv: numeric('current_fmv', { precision: 18, scale: 4 }),
});

export const lifePlans = pgTable('life_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  planType: lifePlanTypeEnum('plan_type').notNull(),
  name: text('name').notNull(),
  targetDate: date('target_date'),
  status: text('status').default('active'),
  inputsJson: jsonb('inputs_json').$type<Record<string, unknown>>(),
  outputsJson: jsonb('outputs_json').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const agentMemories = pgTable('agent_memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  memoryType: text('memory_type').notNull(),
  content: text('content').notNull(),
  confidence: numeric('confidence', { precision: 4, scale: 2 }),
  source: text('source'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const advisorFirms = pgTable('advisor_firms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  brandColorsJson: jsonb('brand_colors_json'),
  customDomain: text('custom_domain'),
  planTier: text('plan_tier'),
});

export const advisorClients = pgTable('advisor_clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  firmId: uuid('firm_id').references(() => advisorFirms.id, { onDelete: 'cascade' }).notNull(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  advisorUserId: uuid('advisor_user_id').references(() => users.id),
  status: text('status').default('active'),
  notes: text('notes'),
  lastReviewDate: date('last_review_date'),
  nextReviewDate: date('next_review_date'),
});

export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  orgOverridesJson: jsonb('org_overrides_json').$type<Record<string, boolean>>(),
});
