# Performance budgets

Targets for the web app (`apps/web`). Measure with Lighthouse CI / Web Vitals in staging before release.

## Budgets

| Budget | Target | Notes |
|--------|--------|-------|
| Initial JS (gzipped, route `/app`) | ≤ 250 KB | Framework + app shell; defer hub-specific charts |
| Total JS (gzipped, first load) | ≤ 400 KB | Includes shared vendors |
| LCP | ≤ 2.5 s | On mid-tier laptop, cable |
| INP | ≤ 200 ms | Action queue + nav |
| CLS | ≤ 0.1 | Reserve skeleton space |
| Lighthouse Performance | ≥ 85 | Mobile emulation |
| Lighthouse Accessibility | ≥ 90 | Required |
| Time to interactive (app shell) | ≤ 3.5 s | Cached SW shell helps repeat visits |

## PWA / offline

- Service worker caches app-shell routes (`/`, `/app`, `/app/inbox`, `/app/settings`) and `offline.html`.
- Soft install prompt must not block primary tasks.
- Push remains opt-in stub until FCM/Web Push is production-ready.

## Enforcement

- Comment budgets in PR when adding large client dependencies.
- Prefer route-level code splitting for heavy hubs (forecasts, investments, agents).
- Do not ship uncached full-page screenshots or multi-MB JSON into the critical path.
