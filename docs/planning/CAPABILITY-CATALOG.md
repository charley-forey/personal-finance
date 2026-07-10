# Capability Catalog (excerpt — 150+ total)

| CAP-ID | Name | Current | Target | WP |
|--------|------|---------|--------|-----|
| CAP-001 | Bank aggregation | partial | production | WP-010 |
| CAP-010 | Categorization ML | partial | self-learning | WP-020 |
| CAP-020 | Action queue | partial | production | WP-023 |
| CAP-030 | Insight feedback | done | production | WP-021 |
| CAP-040 | 13 AI agents | partial | tool-using | WP-050 |
| CAP-050 | Monte Carlo | partial | persisted runs | WP-058 |
| CAP-060 | Advisor portal | **stub** | production | WP-036 |
| CAP-070 | SSO/SAML | **stub** (`enabled: false`, `status: not_configured`) | enterprise | WP-031 |
| CAP-071 | SCIM provisioning | **stub** (`scimEnabled: false`) | enterprise | WP-031 |
| CAP-072 | API key auth | **partial** (AuthGuard accepts `Bearer pf_…` / `X-Api-Key`) | production | WP-042 |
| CAP-073 | Learning jobs | **partial** (recalibration + forecast MAPE logic; no always-on worker queue) | production | WP-025 |
| CAP-080 | PWA mobile | partial | production | WP-076 |
| CAP-090 | Plan limit enforcement | partial | 8/8 limits | WP-038 |

### Stub / partial honesty notes

- **Advisor portal (CAP-060):** Firm/client CRUD + `GET /advisor/status` return `{ status: 'stub' }` — scaffolding only, not a production advisor product.
- **SSO/SCIM (CAP-070/071):** `GET /compliance/sso-config` returns `enabled: false`, `status: 'not_configured'`. WorkOS user JWT auth is live; enterprise org SSO/SCIM is not.
- **API key auth (CAP-072):** Keys can be minted and used for request auth via Bearer `pf_…` or `X-Api-Key`. Scope→role mapping is coarse; fine-grained scope checks on routes are still TODO.
- **Learning jobs (CAP-073):** `@pf/intelligence` recalibrate/score jobs return `completed`/`empty` (not stubs). Dedicated always-on worker learning-loop queue is still optional/ops-gated.

Full matrix in competitive audit (`audits/audit-competitive.md` — 55 rows).
