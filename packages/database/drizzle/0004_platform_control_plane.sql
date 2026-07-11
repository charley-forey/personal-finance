-- Platform Control Plane schema
CREATE TYPE "public"."platform_role" AS ENUM(
  'platform_owner',
  'platform_admin',
  'support_agent',
  'billing_ops',
  'eng_ops',
  'security_compliance',
  'readonly_analyst'
);--> statement-breakpoint
CREATE TYPE "public"."org_lifecycle_status" AS ENUM('active', 'suspended', 'pending_deletion');--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "status" "org_lifecycle_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_admins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "email" text NOT NULL,
  "role" "platform_role" DEFAULT 'readonly_analyst' NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "platform_admins_email_idx" ON "platform_admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_admins_user_idx" ON "platform_admins" USING btree ("user_id");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "platform_admins" ADD CONSTRAINT "platform_admins_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" uuid,
  "actor_email" text NOT NULL,
  "permission" text,
  "action" text NOT NULL,
  "entity_type" text,
  "entity_id" text,
  "target_org_id" uuid,
  "reason" text,
  "before_json" jsonb,
  "after_json" jsonb,
  "metadata_json" jsonb,
  "ip" text,
  "request_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_audit_actor_idx" ON "admin_audit_logs" USING btree ("actor_email","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_audit_org_idx" ON "admin_audit_logs" USING btree ("target_org_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_audit_action_idx" ON "admin_audit_logs" USING btree ("action","created_at");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actor_user_id_users_id_fk"
    FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_target_org_id_organizations_id_fk"
    FOREIGN KEY ("target_org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL,
  "author_user_id" uuid,
  "author_email" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_notes_org_idx" ON "support_notes" USING btree ("org_id","created_at");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "support_notes" ADD CONSTRAINT "support_notes_org_id_organizations_id_fk"
    FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "support_notes" ADD CONSTRAINT "support_notes_author_user_id_users_id_fk"
    FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_cases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL,
  "subject" text NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "priority" text DEFAULT 'normal' NOT NULL,
  "playbook_key" text,
  "assignee_email" text,
  "created_by_email" text NOT NULL,
  "metadata_json" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "closed_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_cases_org_idx" ON "support_cases" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "support_cases_status_idx" ON "support_cases" USING btree ("status","updated_at");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_org_id_organizations_id_fk"
    FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "impersonation_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" uuid,
  "actor_email" text NOT NULL,
  "target_org_id" uuid NOT NULL,
  "target_user_id" uuid,
  "reason" text NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone,
  "metadata_json" jsonb DEFAULT '{}'::jsonb
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "impersonation_actor_idx" ON "impersonation_sessions" USING btree ("actor_email","started_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "impersonation_org_idx" ON "impersonation_sessions" USING btree ("target_org_id","started_at");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_actor_user_id_users_id_fk"
    FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_target_org_id_organizations_id_fk"
    FOREIGN KEY ("target_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_target_user_id_users_id_fk"
    FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "severity" text DEFAULT 'warning' NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "metadata_json" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "acknowledged_at" timestamp with time zone,
  "resolved_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_alerts_status_idx" ON "platform_alerts" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_alerts_key_idx" ON "platform_alerts" USING btree ("key");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entitlement_overrides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL,
  "max_banks" integer,
  "max_ai_messages_monthly" integer,
  "max_documents" integer,
  "history_days" integer,
  "reason" text NOT NULL,
  "granted_by_email" text NOT NULL,
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entitlement_overrides_org_idx" ON "entitlement_overrides" USING btree ("org_id");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "entitlement_overrides" ADD CONSTRAINT "entitlement_overrides_org_id_organizations_id_fk"
    FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_metric_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snapshot_date" text NOT NULL,
  "metrics_json" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "platform_metric_snapshots_date_idx" ON "platform_metric_snapshots" USING btree ("snapshot_date");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dsar_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL,
  "user_id" uuid,
  "request_type" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "requested_by_email" text NOT NULL,
  "approved_by_email" text,
  "reason" text,
  "result_json" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dsar_requests_status_idx" ON "dsar_requests" USING btree ("status","created_at");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "dsar_requests" ADD CONSTRAINT "dsar_requests_org_id_organizations_id_fk"
    FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "dsar_requests" ADD CONSTRAINT "dsar_requests_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "complimentary_grants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL,
  "plan_tier" text NOT NULL,
  "reason" text NOT NULL,
  "granted_by_email" text NOT NULL,
  "expires_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comp_grants_org_idx" ON "complimentary_grants" USING btree ("org_id");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "complimentary_grants" ADD CONSTRAINT "complimentary_grants_org_id_organizations_id_fk"
    FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
INSERT INTO "platform_admins" ("email", "role", "active")
VALUES ('charley.s.forey@gmail.com', 'platform_owner', true)
ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role", "active" = true, "updated_at" = now();
