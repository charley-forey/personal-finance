# Weekly scorecard ritual

## Cadence

Every Monday (or first business day), 20 minutes. Owner: eng on-call + product.

## Inputs

- Sentry: new issues, error rate vs prior week
- Billing: AI messages / Pro user, Stripe failures
- Intelligence: insight acceptance, forecast MAPE samples, action-queue WVA completes
- Sync: Plaid sync failure rate, items needing re-auth
- Support: top 3 themes

## Scorecard template

| Metric | Target | This week | Prior | Notes |
|--------|--------|-----------|-------|-------|
| API error rate | < 1% | | | |
| Agent p95 latency | ≤ 8s | | | |
| LLM $/Pro user | ≤ $0.50 | | | |
| Insight acceptance | ≥ 30% | | | |
| Forecast MAPE | ≤ 15% | | | |
| Plaid sync success | ≥ 98% | | | |
| WVA / user / week | ≥ 1.0 | | | |
| Time-to-first-link (p50) | ≤ 10 min | | | |
| Action Queue completion | ≥ 40% | | | |
| ⌘K / search usage | trending up | | | |
| P0 incidents | 0 | | | |

## Ritual

1. Fill the table from dashboards / SQL / Sentry.
2. Mark any IQG breach — open or update a tracking issue.
3. Decide flag expansions or kill-switch needs.
4. File one improvement ticket max (avoid backlog thrash).
5. Archive the filled table in the team wiki or `#ops-scorecard` thread.
