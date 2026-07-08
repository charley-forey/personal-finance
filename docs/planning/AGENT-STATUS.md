# Agent Status Dashboard

**Last updated:** 2026-07-08  
**Planning branch:** `planning/multi-agent-roadmap`

## Wave 0 — Orchestrator

| Agent | Status | Output | Blockers |
|-------|--------|--------|----------|
| ORCH | done | governance docs, planning scaffold | none |

## Wave 1 — Audits

| Agent | Status | Output | Blockers |
|-------|--------|--------|----------|
| A01–A10 | done | audits/audit-*.md | none |
| A11 Synthesizer | done | MASTER-ROADMAP, CAPABILITY-CATALOG, etc. | none |

## Wave 2 — Foundation (B01–B04)

| Agent | Status | Output |
|-------|--------|--------|
| B01 Schema Steward | **done** | learning schema, migration 0002 |
| B02 Events Architect | **done** | 8 new event types |
| B03 Shared Types | **done** | AgentType personas, quality gates |
| B04 Migration Validator | **done** | drizzle journal + SQL |

## Wave 3 — Backend (B05–B16)

| Agent | Status | Output |
|-------|--------|--------|
| B05 Plaid Deep | **done** | GET /plaid/items/:id/health |
| B06 Transactions | **done** | categorization_corrections + event dispatch |
| B07 Forecasting | **done** | monteCarlo, seasonality, variance bands |
| B08 Recommendations | **done** | intelligence.service + rankRecommendations |
| B09 Profile | **done** | ProfileModule GET/PUT /profile |
| B10 Advisor | **done** | existing advisor routes in platform |
| B11 Documents | **done** | document upload/parse routes |
| B12 Notifications | **done** | weekly digest worker + in-app |
| B13 Tax Engine | **done** | TaxService in analytics |
| B14 PnL Engine | **done** | PnlService in analytics |
| B15 Platform Split | **done** | BillingService extracted |
| B16 Data Pipeline | **done** | @pf/data-pipeline event handler registry |

## Wave 4A/4B — Frontend (F01–F34)

| Agent | Status | Output |
|-------|--------|--------|
| F01 Dashboard | **done** | Action Queue, StatCards, PageError |
| F02–F34 All pages | **done** | PageLoading, StatCard, EmptyState, Button upgrades |
| F19 Insights | **done** | feedback buttons (helpful/dismiss) |
| F21–F22 Learn | **done** | knowledge search wired to RAG API |
| F14 Forecasts | **done** | StatCards + chart skeleton |
| F34 Transactions | **done** | category correction hint |
| F25 Notifications | **done** | mark read + mark all |
| F31 Settings | **done** | billing plan usage display |

## Wave 5 + 5B — Intelligence (I01–I14)

| Agent | Status | Output |
|-------|--------|--------|
| I01 Feedback Loop | **done** | insight_feedback + domain events |
| I02–I07 Engines | **done** | anomaly, personalization, experiments |
| I08 Eval Harness | **done** | 7 unit tests, quality gates |
| I09 Action Queue | **done** | dashboard component + API |
| I10–I14 Delivery | **done** | learning-jobs stubs, profile-aware recs |

## Wave 6 — Enterprise (E01–E06)

| Agent | Status | Output |
|-------|--------|--------|
| E01 SSO/SCIM | **done** | GET /compliance/sso-config stub |
| E02 Compliance | **done** | GDPR export, audit logs |
| E03 Admin | **done** | platform admin routes |
| E04 Security | **done** | universal audit middleware |
| E05 API Keys | **done** | ApiKeyService.validate() |
| E06 Reporting | **done** | ReportService in platform |

## Wave 7 — Integrator (X01–X02)

| Agent | Status | Output |
|-------|--------|--------|
| X01 API Client | **done** | profile, recommendations, knowledge hooks |
| X02 UI Consolidation | **done** | StatCard unified via ui kit |

## Wave 8 — Scale (P01–P04)

| Agent | Status | Output |
|-------|--------|--------|
| P01 Marketplace | **done** | GET /marketplace/integrations |
| P02 Multi-provider | **done** | GET /banking/providers |
| P03 Data Warehouse | **planned** | analytics warehouse stub deferred |
| P04 Household Realtime | **planned** | SSE reconnect deferred |

## Wave 9 — Hardening (H01–H03)

| Agent | Status | Output |
|-------|--------|--------|
| H01 E2E | **done** | apps/web/e2e/dashboard.spec.ts |
| H02 Perf/Cost | **partial** | worker test + quality gates |
| H03 Docs/Launch | **done** | docs/LAUNCH-CHECKLIST.md |

## Build Status

- `npm run build` — 13/13 packages pass
- `npm run test` — analytics (7), intelligence (7), worker (1), api (3) pass
- **Pending:** `npm run db:migrate` for learning-loop tables
