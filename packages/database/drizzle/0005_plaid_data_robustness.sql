-- Phase 1–3 Plaid data robustness
ALTER TABLE plaid_items ADD COLUMN IF NOT EXISTS sync_warnings jsonb DEFAULT '[]'::jsonb;
ALTER TABLE plaid_items ADD COLUMN IF NOT EXISTS last_sync_job_id text;

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS purpose text;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS purpose_override boolean DEFAULT false NOT NULL;

ALTER TABLE account_balances ADD COLUMN IF NOT EXISTS sync_job_id text;

ALTER TABLE investment_securities ADD COLUMN IF NOT EXISTS plaid_security_id text;
CREATE UNIQUE INDEX IF NOT EXISTS investment_securities_plaid_id_idx
  ON investment_securities (plaid_security_id)
  WHERE plaid_security_id IS NOT NULL;

ALTER TABLE investment_holdings ADD COLUMN IF NOT EXISTS sync_job_id text;
CREATE INDEX IF NOT EXISTS holdings_org_account_captured_idx
  ON investment_holdings (org_id, account_id, captured_at);

ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS plaid_investment_transaction_id text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS subtype text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS price numeric(18, 4);
ALTER TABLE investment_transactions ADD COLUMN IF NOT EXISTS sync_job_id text;
CREATE UNIQUE INDEX IF NOT EXISTS inv_txn_org_plaid_idx
  ON investment_transactions (org_id, plaid_investment_transaction_id)
  WHERE plaid_investment_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS inv_txn_org_date_idx ON investment_transactions (org_id, date);

ALTER TABLE liabilities ADD COLUMN IF NOT EXISTS sync_job_id text;
CREATE INDEX IF NOT EXISTS liabilities_org_account_captured_idx
  ON liabilities (org_id, account_id, captured_at);
