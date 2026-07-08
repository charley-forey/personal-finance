# User Value Flywheel

```
Link accounts → categorize → budget baseline
  → first proactive alert (post-sync)
  → weekly personalized insight
  → user feedback (thumbs / act / dismiss)  ← WP-021 DONE
  → user_signals capture                   ← WP-022 DONE
  → feature store (nightly)
  → recommendation ranking               ← WP-024 DONE
  → Action Queue on dashboard              ← WP-023 IN PROGRESS
  → outcome tracking                       ← recommendation_outcomes DONE
  → model/prompt improvement
  → higher WVA → retention
```

## North Star

**Weekly Valuable Actions (WVA)** — ≥1 measurable financial action per user per week.

## User Value Equation

`UserValue = (Relevance × Actionability × Timeliness × Trust) / CognitiveLoad`

## Implementation status

| Loop stage | Table/API | Status |
|------------|-----------|--------|
| Feedback | `insight_feedback`, `POST /insights/:id/feedback` | done |
| Signals | `user_signals`, `POST /signals` | done |
| Recommendations | `recommendation_items`, `/recommendations` | done |
| Outcomes | `recommendation_outcomes` | done |
| Forecast accuracy | `forecast_runs`, `forecast_accuracy` | schema done |
| Categorization learning | `categorization_corrections` | schema done |
| Feature store batch job | workers `learning-loop` queue | planned WP-025 |
