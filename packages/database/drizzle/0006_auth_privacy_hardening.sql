-- Auth / privacy hardening: advisor ownership, invites, consents, payload archive, deletion grace
ALTER TABLE advisor_firms ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES users(id);
ALTER TABLE advisor_clients ADD COLUMN IF NOT EXISTS scopes_json jsonb DEFAULT '["read_balances"]'::jsonb;
ALTER TABLE advisor_clients ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deletion_scheduled_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_org_id uuid;

CREATE TABLE IF NOT EXISTS organization_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role member_role NOT NULL DEFAULT 'viewer',
  invited_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS org_invites_org_idx ON organization_invites(org_id);
CREATE INDEX IF NOT EXISTS org_invites_email_idx ON organization_invites(email);

CREATE TABLE IF NOT EXISTS org_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  purpose text NOT NULL,
  version text NOT NULL DEFAULT '1',
  granted boolean NOT NULL DEFAULT false,
  granted_at timestamptz,
  revoked_at timestamptz,
  updated_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS org_consents_org_purpose_idx ON org_consents(org_id, purpose);

CREATE TABLE IF NOT EXISTS plaid_payload_archive (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item_id uuid REFERENCES plaid_items(id) ON DELETE SET NULL,
  kind text NOT NULL,
  plaid_id text,
  payload jsonb NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS plaid_archive_org_kind_idx ON plaid_payload_archive(org_id, kind, captured_at);
CREATE INDEX IF NOT EXISTS plaid_archive_item_idx ON plaid_payload_archive(item_id, captured_at);

-- Optional RLS helper: app sets app.current_org_id per request (defense in depth)
-- Policies are additive; application still filters by org_id.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'tenant_isolation_transactions'
  ) THEN
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY tenant_isolation_transactions ON transactions
      USING (org_id::text = NULLIF(current_setting('app.current_org_id', true), ''));
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RLS setup skipped: %', SQLERRM;
END $$;
