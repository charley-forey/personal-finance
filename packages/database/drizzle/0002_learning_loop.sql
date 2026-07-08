CREATE TABLE IF NOT EXISTS "financial_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" uuid REFERENCES "users"("id") ON DELETE cascade,
  "life_stage" text,
  "risk_tolerance" text,
  "filing_status" text,
  "dependents" integer DEFAULT 0,
  "annual_income" numeric(18, 2),
  "state_code" text,
  "goals_summary" text,
  "metadata_json" jsonb DEFAULT '{}'::jsonb,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "financial_profile_org_user_idx" ON "financial_profiles" ("org_id", "user_id");

CREATE TABLE IF NOT EXISTS "user_signals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" uuid REFERENCES "users"("id") ON DELETE cascade,
  "signal_type" text NOT NULL,
  "entity_type" text,
  "entity_id" text,
  "payload_json" jsonb DEFAULT '{}'::jsonb,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "user_signals_org_type_idx" ON "user_signals" ("org_id", "signal_type", "occurred_at");

CREATE TABLE IF NOT EXISTS "categorization_corrections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" uuid REFERENCES "users"("id") ON DELETE set null,
  "transaction_id" uuid NOT NULL REFERENCES "transactions"("id") ON DELETE cascade,
  "prior_category_id" uuid,
  "new_category_id" uuid NOT NULL,
  "merchant_name" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "cat_corrections_org_idx" ON "categorization_corrections" ("org_id", "created_at");

CREATE TABLE IF NOT EXISTS "insight_feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" uuid REFERENCES "users"("id") ON DELETE set null,
  "insight_id" uuid NOT NULL REFERENCES "insights"("id") ON DELETE cascade,
  "helpful" boolean,
  "acted_on" boolean DEFAULT false,
  "dismissed" boolean DEFAULT false,
  "reason" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "insight_feedback_org_idx" ON "insight_feedback" ("org_id", "insight_id");

CREATE TABLE IF NOT EXISTS "recommendation_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" uuid REFERENCES "users"("id") ON DELETE set null,
  "title" text NOT NULL,
  "body" text,
  "action_type" text NOT NULL,
  "priority_score" numeric(8, 4),
  "confidence" numeric(4, 2),
  "status" text DEFAULT 'pending' NOT NULL,
  "metadata_json" jsonb DEFAULT '{}'::jsonb,
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "recommendation_org_status_idx" ON "recommendation_items" ("org_id", "status", "priority_score");

CREATE TABLE IF NOT EXISTS "recommendation_outcomes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "recommendation_id" uuid NOT NULL REFERENCES "recommendation_items"("id") ON DELETE cascade,
  "outcome" text NOT NULL,
  "notes" text,
  "recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "recommendation_outcomes_org_idx" ON "recommendation_outcomes" ("org_id", "recorded_at");

CREATE TABLE IF NOT EXISTS "forecast_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "forecast_id" uuid REFERENCES "forecasts"("id") ON DELETE set null,
  "model_type" text NOT NULL,
  "horizon_days" integer NOT NULL,
  "inputs_json" jsonb NOT NULL,
  "outputs_json" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "forecast_runs_org_idx" ON "forecast_runs" ("org_id", "created_at");

CREATE TABLE IF NOT EXISTS "forecast_accuracy" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "forecast_run_id" uuid NOT NULL REFERENCES "forecast_runs"("id") ON DELETE cascade,
  "metric" text NOT NULL,
  "predicted" numeric(18, 4),
  "actual" numeric(18, 4),
  "error_pct" numeric(8, 4),
  "evaluated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "forecast_accuracy_org_idx" ON "forecast_accuracy" ("org_id", "evaluated_at");

CREATE TABLE IF NOT EXISTS "prompt_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "agent_type" text NOT NULL,
  "version" text NOT NULL,
  "content_hash" text NOT NULL,
  "content" text NOT NULL,
  "is_active" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "prompt_versions_agent_version_idx" ON "prompt_versions" ("agent_type", "version");

CREATE TABLE IF NOT EXISTS "model_evaluations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid REFERENCES "organizations"("id") ON DELETE cascade,
  "agent_type" text,
  "prompt_version_id" uuid REFERENCES "prompt_versions"("id") ON DELETE set null,
  "score" numeric(6, 4),
  "metrics_json" jsonb DEFAULT '{}'::jsonb,
  "evaluated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "model_evaluations_agent_idx" ON "model_evaluations" ("agent_type", "evaluated_at");
