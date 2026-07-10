# Kill switches

Environment flags that disable expensive or risky subsystems without a full rollback. Set on API and workers, then restart processes.

| Env var | Effect when set | Default |
|---------|-----------------|---------|
| `AI_ENABLED=false` | Disable agent chat, embeddings, and LLM document extraction; return structured disabled responses | unset (on) |
| `PLAID_SYNC_ENABLED=false` | Skip enqueueing / processing Plaid sync jobs | unset (on) |
| `INTELLIGENCE_JOBS_ENABLED=false` | Skip learning-loop recalibration / forecast scoring workers | unset (on) |
| `EVENT_PIPELINE_ENABLED=false` | Skip domain-event handler processing | unset (on) |
| `SSE_ENABLED=false` | Disable `/events/stream` (clients fall back to polling) | unset (on) |
| `ADVISOR_PORTAL_ENABLED=false` | Force advisor routes to stub/disabled responses | unset |
| `REQUIRE_FULL_ENV=true` | Fail boot if production auth/crypto keys missing (also implied by `NODE_ENV=production`) | unset |

## Feature-flag complements

Prefer DB/Unleash flags for gradual rollout (`ai_agents`, `advisor_portal`, etc.). Use env kill switches for hard, fleet-wide stops.

## Procedure

1. Set the env var in the deployment environment.
2. Restart API (`apps/api`) and `workers`.
3. Verify health endpoint and a canary user flow.
4. Record the incident in the weekly scorecard.
