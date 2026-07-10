# ADR 003: Intelligence loop

## Status

Accepted

## Context

The product differentiates on a closed-loop intelligence system: signals → models/jobs → recommendations → user outcomes → recalibration. Stub learning jobs blocked honest capability reporting and CI quality gates.

## Decision

1. **Learning jobs** in `@pf/intelligence` implement real (pure) recalibration and forecast MAPE scoring. Workers/API may pass DB-fetched corrections/observations; empty input returns `status: 'empty'`, successful runs return `status: 'completed'`.
2. **Quality gates** live in `INTELLIGENCE_QUALITY_GATES` (`@pf/shared`) and `docs/planning/INTELLIGENCE-QUALITY-GATES.md`. CI runs `npm run test --workspace=@pf/intelligence`.
3. **Action queue WVA** (Weighted Value Action) is tracked client-side via `trackWva` for engagement telemetry.
4. **Event pipeline** registers handlers for category corrections, insight feedback, Plaid sync, recommendation completion, plus signal-ack handlers for budget/goal/insight/forecast/recommendation events.
5. **LLM cost awareness:** Agents UI surfaces plan AI message usage; billing plan limits remain the enforcement layer.

## Consequences

- Capability catalog must distinguish “learning job logic exists” from “dedicated worker queue always-on.”
- Eval harness scenarios expand with product pages; IQG-10 requires green intelligence tests on PR.
