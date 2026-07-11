# Data catalog

Max-capture vault: normalized product tables plus `plaid_payload_archive` for full Plaid fidelity.

| Key | Description | Retention |
|-----|-------------|-----------|
| accounts | Linked bank/investment accounts | Until wipe/delete |
| transactions | Normalized history (+ inline raw_json) | Until wipe/delete |
| holdings | Investment position snapshots | Until wipe/delete |
| liabilities | Credit/loan details | Until wipe/delete |
| recurring | Bills/subscriptions | Until delete |
| insights | Generated insights | Until delete |
| recommendations | Action queue | Until delete |
| agent_conversations | AI chat | Until delete |
| documents | Uploaded files | Until delete |
| plaid_archive | Full provider payloads | Until delete |
| audit_logs | Security events | Long / legal hold |

Consent purposes (use, not storage): `ai_full_context`, `advisor_sharing`, `marketing`.
