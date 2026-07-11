# Audit: Security (A08)

**Score: 7.2/10** — WorkOS JWT + org-scoped AuthContext; Plaid token AES-GCM; advisor kill switch; PnL/scenario/document org checks; owner-gated export; consent-for-use; act-as defaults to viewer.

## Threat model (summary)

| Threat | Mitigation |
|--------|------------|
| Cross-tenant IDOR | `orgId` on every mutate; advisor firm ownership; tenant isolation tests |
| Stolen Bearer token (XSS) | AuthKit refresh; 401 clears session; prefer short-lived cache |
| Advisor open routes | `ADVISOR_PORTAL_ENABLED=false` → 404; firm access checks |
| Act-as privilege abuse | Default viewer role; DB impersonation session required |
| Encryption key reuse | `TOKEN_ENCRYPTION_KEY` + `TOKEN_ENCRYPTION_SALT` required in prod |

## PII / data map

See Settings → Your data and `DATA_CATALOG` in `apps/api/src/services/platform.services.ts`.

Categories: accounts, transactions (+ raw archive), holdings, liabilities, recurring, insights, recommendations, AI conversations, documents, audit logs.

**Policy:** maximize capture into normalized tables + `plaid_payload_archive`. Privacy controls who can *use* data (consent), not how much we store.

## Retention

| Data | Retention |
|------|-----------|
| Financial vault + raw archive | Until user wipe / account deletion |
| Ops noise (webhook delivery, expired DSAR artifacts, agent memory `expiresAt`) | Sweeper TTL |
| Audit logs | Long retention; legal hold exception |

## Key rotation

1. Set new `TOKEN_ENCRYPTION_KEY` / `TOKEN_ENCRYPTION_SALT` in a dual-read window.
2. Re-encrypt all `plaid_items.access_token_encrypted` with the new key.
3. Remove old key from env.

## Kill switches

- `ADVISOR_PORTAL_ENABLED=false`
- `PLAID_SYNC_ENABLED=false`

## Evidence pack (SOC2-oriented)

- Access reviews: platform admins table + org members export
- DSAR: `GET /compliance/export` (owner) + audit `data.export`
- Encryption config: env validation requires key+salt in production
- Isolation: `apps/api/test/tenant-isolation.test.ts` + `tenant-isolation-fuzz.test.ts`

*Updated with auth/privacy hardening wave.*
