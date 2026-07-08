# Intelligence Architecture

## Six layers

1. **Data ingestion** — Plaid, manual entry, documents, profile, signals
2. **Feature engineering** — baselines, seasonality, merchant graph, embeddings
3. **Intelligence engines** — rules, stats, ML, LLM (right tool per job)
4. **Insight & action** — insights, forecasts, recommendations, anomalies
5. **Delivery & UX** — Action Queue, notifications, drill-down, agents
6. **Learning loop** — feedback, eval, experiments, prompt registry

## Packages

| Package | Role | Status |
|---------|------|--------|
| `@pf/intelligence` | Ranking, quality gates | **implemented** |
| `@pf/ai` | LLM adapters | existing |
| `@pf/sync` | Post-sync, RAG | existing |
| `@pf/forecasting` | Time-series + MC | planned B07 |
| `@pf/recommendations` | Merged into intelligence + API | **partial** |

## Agent personas (13)

5 existing + 8 new types in `@pf/shared` `AgentType`.

## Quality gates

See `INTELLIGENCE-QUALITY-GATES.md` and `passesQualityGate()` in `@pf/intelligence`.

## Learning jobs (target)

| Job | Frequency |
|-----|-----------|
| `recalibrate-categories` | Daily |
| `score-forecast-accuracy` | On PnL close |
| `rank-insight-templates` | Weekly |
| `eval-agent-prompts` | Weekly |
| `compute-features` | Nightly |
