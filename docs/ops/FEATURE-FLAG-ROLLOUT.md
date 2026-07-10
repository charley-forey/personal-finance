# Feature flag rollout playbook

## Purpose

Roll out risky surfaces (AI agents, advisor portal, GraphQL, voice) safely with Unleash/DB flags and env kill switches.

## Flag inventory (defaults)

| Key | Default | Notes |
|-----|---------|-------|
| `ai_agents` | on | Agent chat + tools |
| `monte_carlo` | on | Retirement simulations |
| `tax_center` | on | Tax surfaces |
| `advisor_portal` | off | Stub only — keep off in prod |
| `voice_interface` | off | Experimental |
| `graphql_api` | off | Experimental |

Flags are read by `FeatureFlagService` (DB override → default). Org overrides live in `feature_flags.org_overrides_json`.

## Rollout steps

1. **Dark launch:** Flag off globally; deploy code.
2. **Internal:** Enable for platform-admin orgs only via org override.
3. **Canary:** Enable for 5–10% of orgs (or a named allowlist).
4. **Monitor:** Error rate, LLM cost, p95 latency, support tickets (see weekly scorecard).
5. **Expand or kill:** If IQG or error budgets breach, disable flag and/or env kill switch.
6. **Default on:** Only after two clean weekly scorecards.

## Emergency

1. Flip DB flag `enabled: false` for the key.
2. If needed, set env kill switch (see `KILL-SWITCHES.md`) and restart API/workers.
3. Post in ops channel with incident timestamp and rollback commit SHA.
