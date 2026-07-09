# Agent Prompt Pack — Wave 10 Revolution

## Cross-cutting (Phase 1)

| ID | Agent | ALLOWED paths |
|----|-------|---------------|
| G01 | Graph Architect | `packages/graph/**`, `packages/database/**` (entity_links only), `apps/api/src/modules/graph/**` |
| C01 | Context Engine | `packages/context/**`, `apps/api/src/modules/context/**` |
| N01 | Narrative Copilot | `packages/narrative/**`, `apps/api/src/modules/narrative/**`, `apps/web/src/components/explain-button.tsx` |

## Hub integrators (Phase 2)

| ID | Hub | Route | ALLOWED |
|----|-----|-------|---------|
| H01 | Command Center | `/app` | dashboard enhancements only |
| H02 | Cash Flow | `/app/cash-flow` | hub landing page |
| H03 | Plan & Control | `/app/plan` | hub landing page |
| H04 | Wealth | `/app/wealth` | hub landing page |
| H05 | Future | `/app/future` | hub landing page |
| H06 | Library | `/app/library` | hub landing page |

## Page revolution (Phase 3)

| ID | Page | Route | Hub |
|----|------|-------|-----|
| R01 | Dashboard | /app | H01 |
| R02 | Accounts | /app/accounts | H02 |
| R03 | Transactions | /app/transactions | H02 |
| R04 | Activity | /app/activity | H02 |
| R05 | Income | /app/income | H02 |
| R06 | Expenses | /app/expenses | H02 |
| R07 | Subscriptions | /app/subscriptions | H02 |
| R09 | P&L | /app/pnl | H03 |
| R10 | Budgets | /app/budgets | H03 |
| R11 | Calendar | /app/calendar | H02 |
| R12 | Rules | /app/rules | H03 |
| R13 | Scenarios | /app/scenarios | H05 |
| R14 | Investments | /app/investments | H04 |
| R15 | Net Worth | /app/net-worth | H04 |
| R16 | Forecasts | /app/forecasts | H04 |
| R17 | Retirement | /app/retirement | H05 |
| R18 | FIRE | /app/fire | H05 |
| R19 | Insights | /app/insights | H01 |
| R20 | Credit | /app/credit | H05 |
| R21 | Debt | /app/debt | H05 |
| R22 | Goals | /app/goals | H03 |
| R23 | Equity | /app/equity | H04 |
| R24 | Taxes | /app/taxes | H05 |
| R25 | Agents | /app/agents | H01 |
| R26 | Inbox | /app/inbox | H01 |
| R27 | Health | /app/health | H01 |
| R28 | Notifications | /app/notifications | H01 |
| R29 | Onboarding | /app/onboarding | H06 |
| R30 | Learn | /app/learn | H06 |
| R31 | Assets | /app/assets | H04 |
| R32 | Documents | /app/documents | H06 |
| R33 | Settings | /app/settings | H06 |
| R34 | Life Plans | /app/life-plans | H05 |

## Prompt template

```markdown
# Agent: R## — <Page Name> Revolution
Worktree: ../pf-rev-<page>
Branch: agent/rev-<page>
Hub: H0#
Depends on: G01 (graph), C01 (context)

REQUIRED UI:
- [ ] PageContextBanner
- [ ] Min 2 EntityGraphPanel integrations
- [ ] Min 1 ExplainButton on primary metric
- [ ] Cross-link to 2+ related pages
```
