# Intelligence Quality Gates

Intelligence features **cannot ship to production** without passing these gates.

| Gate ID | Metric | Threshold | Measurement |
|---------|--------|-----------|-------------|
| IQG-01 | Factual accuracy (cited numbers) | ≥ 98% | Automated eval vs DB |
| IQG-02 | Categorization accuracy (30d) | ≥ 85% | corrections / total |
| IQG-03 | 30-day cash forecast MAPE | ≤ 15% | forecast_accuracy table |
| IQG-04 | Insight acceptance rate | ≥ 30% | insight_feedback |
| IQG-05 | False positive anomalies | ≤ 5% | dismiss rate |
| IQG-06 | Agent response latency p95 | ≤ 8s | agent_runs |
| IQG-07 | LLM cost per Pro user/mo | ≤ $0.50 | billing telemetry |
| IQG-08 | Hallucination rate | ≤ 1% | eval harness |
| IQG-09 | Citation coverage (agent facts) | ≥ 90% | eval harness |
| IQG-10 | Eval harness pass on PR | 100% | CI `@pf/intelligence` tests |

## Implementation

Constants defined in `packages/shared/src/index.ts` as `INTELLIGENCE_QUALITY_GATES`.

Evaluation helpers in `packages/intelligence/src/index.ts` — `passesQualityGate()`.

## Release Checklist

- [ ] Golden dataset case added for new intelligence feature
- [ ] Tool-verified numeric claims only
- [ ] Educational disclaimers on actionable advice
- [ ] Plan tier limits enforced
- [ ] `agent_runs` logged with correlation ID
- [ ] IQG-10 CI green
