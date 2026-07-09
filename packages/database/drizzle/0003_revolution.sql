CREATE TABLE IF NOT EXISTS "entity_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "source_type" text NOT NULL,
  "source_id" text NOT NULL,
  "target_type" text NOT NULL,
  "target_id" text NOT NULL,
  "link_type" text NOT NULL,
  "weight" numeric(8, 4) DEFAULT '1',
  "metadata_json" jsonb DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "entity_links_org_source_idx" ON "entity_links" ("org_id", "source_type", "source_id");
CREATE INDEX IF NOT EXISTS "entity_links_org_target_idx" ON "entity_links" ("org_id", "target_type", "target_id");
CREATE INDEX IF NOT EXISTS "entity_links_org_type_idx" ON "entity_links" ("org_id", "link_type");

CREATE TABLE IF NOT EXISTS "journey_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
  "hub_id" text NOT NULL,
  "step_id" text NOT NULL,
  "completed" boolean DEFAULT false NOT NULL,
  "completed_at" timestamp with time zone,
  "metadata_json" jsonb DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "journey_progress_org_user_hub_step_idx" ON "journey_progress" ("org_id", "user_id", "hub_id", "step_id");
CREATE INDEX IF NOT EXISTS "journey_progress_org_hub_idx" ON "journey_progress" ("org_id", "hub_id");

CREATE TABLE IF NOT EXISTS "narrative_cache" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "cache_key" text NOT NULL,
  "content" text NOT NULL,
  "metadata_json" jsonb DEFAULT '{}',
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "narrative_cache_org_key_idx" ON "narrative_cache" ("org_id", "cache_key");
