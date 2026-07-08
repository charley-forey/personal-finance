# Schema Contracts (Wave 2 — Published)

## New tables (`packages/database/src/schema/learning.ts`)

| Table | Purpose |
|-------|---------|
| `financial_profiles` | Explicit user financial context |
| `user_signals` | Implicit behavior events |
| `categorization_corrections` | User relabel feed |
| `insight_feedback` | Insight thumbs/acted/dismissed |
| `recommendation_items` | Action queue items |
| `recommendation_outcomes` | Recommendation learning |
| `forecast_runs` | Immutable forecast snapshots |
| `forecast_accuracy` | Predicted vs actual |
| `prompt_versions` | Agent prompt registry |
| `model_evaluations` | Eval harness scores |

## Migration

- File: `packages/database/drizzle/0002_learning_loop.sql`
- Apply: `npm run db:migrate`

## API shapes (intelligence)

- `POST /insights/:id/feedback` — `{ helpful?, actedOn?, dismissed?, reason? }`
- `GET /recommendations` — list pending items
- `POST /recommendations/generate` — rank from insights
- `POST /recommendations/:id/outcome` — `{ outcome, notes? }`
- `POST /signals` — `{ signalType, entityType?, entityId?, payload? }`

## Shared types (`@pf/shared`)

- `FinancialProfile`, `RecommendationItem`, `InsightFeedbackInput`, `UserSignalInput`
- `AgentType` (13 personas)
- `INTELLIGENCE_QUALITY_GATES`
