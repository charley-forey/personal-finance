# Agent Prompt Pack (Waves 2-9)

Each build agent prompt MUST include: Agent Identity, Write Boundaries, Upstream Dependencies, Mission, Acceptance Criteria, Integration Handoff.

## Wave 2 — Foundation (DONE this session)

| ID | Agent | Boundary | Status |
|----|-------|----------|--------|
| B01 | Schema Steward | `packages/database/**` | done |
| B02 | Events Architect | `packages/events/**` | done |
| B03 | Shared Types | `packages/shared/**` | done |
| B04 | Migration Validator | `packages/database/drizzle/**` | done |

## Wave 3 — Backend (12 parallel)

| ID | Agent | ALLOWED paths |
|----|-------|---------------|
| B05 | Plaid Deep | `apps/api/src/modules/plaid/**`, `packages/plaid-client/**` |
| B06 | Transactions | `apps/api/src/modules/accounts/**`, `category.service.ts` |
| B07 | Forecasting | `packages/forecasting/**`, analytics forecast routes |
| B08 | Recommendations | `packages/intelligence/**`, intelligence.service.ts |
| B09 | Profile | NEW `modules/profile/**` |
| B10 | Advisor | `platform/**` advisor routes |
| B11 | Documents | documents module, `packages/ai/src/documents.ts` |
| B12 | Notifications | `workers/src/notifications.ts` |
| B13 | Tax Engine | tax services in analytics |
| B14 | PnL Engine | PnL services |
| B15 | Platform Split | extract platform.services.ts |
| B16 | Data Pipeline | NEW `packages/data-pipeline/**` |

## Wave 4A/4B — Frontend (34 agents)

One agent per page: `apps/web/src/app/app/<page>/**` only.  
Forbidden: `api.ts`, `use-finance.ts`, `app-shell.tsx` (Integrator only).

F01 Dashboard — **partial done** (Action Queue added)

## Wave 5 + 5B — Intelligence (14 agents)

| ID | Agent | Status |
|----|-------|--------|
| I01 | Feedback Loop | schema done |
| I08 | Eval Harness | `@pf/intelligence` tests done |
| I09 | Action Queue | **done** |
| I01-I14 | See INTELLIGENCE-ARCHITECTURE.md | planned |

## Wave 6 — Enterprise (E01-E06)

SSO/SCIM, Compliance, Admin, Security, API Keys, Reporting

## Wave 7 — Integrator (X01-X02)

`api.ts`, `use-finance.ts`, `app-shell.tsx`, `app.module.ts`, `ui/index.ts`

## Wave 8 — Scale (P01-P04)

Marketplace, multi-provider banking, analytics warehouse, household realtime

## Wave 9 — Hardening (H01-H03)

E2E suite, perf/cost, docs/launch

---

### Prompt template

```markdown
# Agent: <name>
Worktree: ../pf-<name>
Branch: agent/<name>
Lane: <L-A|L-C|L-F|L-E>

ALLOWED: <globs>
FORBIDDEN: packages/database/** (unless B01)

Mission: <specific goals from MASTER-ROADMAP WP-IDs>

Acceptance:
- [ ] npm run build (affected packages)
- [ ] tests added
- [ ] commit prefix [agent:<name>]
```
