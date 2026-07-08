# Master Roadmap — Personal Finance OS

**Version:** 1.0 (Synthesizer A11, 2026-07-08)  
**Horizon:** 0–24 months | **Initiatives:** 90+ | **Build agents:** 46+

## Executive Summary

Personal Finance OS will become a **self-improving, enterprise-grade financial intelligence platform** — aggregating accounts via Plaid, learning from user behavior, and delivering ranked actionable recommendations through an Action Queue and 13 AI agent personas.

### Top 5 strategic bets

1. **Closed-loop intelligence** — feedback tables + learning jobs (WP-002 done)
2. **Action Queue UX** — prescriptive layer beats dashboard-only competitors (WP-023 in progress)
3. **Advisor channel** — firms/clients schema + portal (WP-036)
4. **Data pipeline quality** — sync reliability + categorization accuracy (WP-013–019)
5. **Enterprise trust** — audit logs, SSO, plan enforcement (WP-030–042)

### Top 5 risks

1. Plan limits unenforced → pricing trust failure
2. No worker tests → silent data corruption
3. LLM cost uncapped on paid tiers
4. Schema merge conflicts in parallel waves
5. Mobile gap vs Monarch/Copilot retention

## Wave Execution Summary

| Wave | Theme | Agents | Status |
|------|-------|--------|--------|
| 1 | Audit & Plan | A01–A11 | **done** |
| 2 | Foundation | B01–B04 | **done** (core) |
| 3 | Backend domains | B05–B16 | scaffolded in AGENT-PROMPT-PACK |
| 4A/B | Frontend (34 pages) | F01–F34 | scaffolded |
| 5 + 5B | Intelligence | I01–I14 | **partial** (@pf/intelligence, API, Action Queue) |
| 6 | Enterprise | E01–E06 | planned |
| 7 | Integrator | X01–X02 | planned |
| 8 | Platform scale | P01–P04 | planned |
| 9 | Hardening | H01–H03 | planned |

## P0 Initiatives (next 90 days)

| WP | Initiative | Owner |
|----|------------|-------|
| WP-001 | pgvector native migration | B01 |
| WP-006 | Event handler registry | B16 |
| WP-023 | Action Queue (dashboard) | F01/I09 |
| WP-030 | Universal audit middleware | E04 |
| WP-037 | Stripe lifecycle fix | A09 |
| WP-038 | Enforce all plan limits | A09 |
| WP-043 | CI hardening + worker tests | H01 |
| WP-050 | @pf/intelligence orchestrator | I01 |
| WP-067 | Eval harness CI gate | I08 |

## Horizons

- **H0 (48h):** StatCard unify, insight dismiss API, SSE reconnect
- **H1 (0–3mo):** Foundation + data quality + action queue + billing fixes
- **H2 (3–6mo):** Intelligence v1 + interactive data + personalization
- **H3 (6–12mo):** Prediction engine + enterprise auth + advisor tier
- **H4 (12–24mo):** Autonomous copilot + marketplace + data warehouse

See `CAPABILITY-CATALOG.md`, `WORK-PACKAGE-INDEX.md`, and wave audits in `audits/`.
