# UX scorecard (WVA)

Weekly UX health for Personal Finance OS. Pair with [WEEKLY-SCORECARD.md](./WEEKLY-SCORECARD.md) for reliability/ops metrics.

## Cadence

Every Monday (or first business day), 15 minutes. Owner: product + eng on-call.

## WVA metrics

| Metric | Definition | Target | This week | Prior | Notes |
|--------|------------|--------|-----------|-------|-------|
| Time-to-first-link | Median seconds from `/app` load to first bank link CTA click (or Plaid open) for new orgs | ≤ 60s | | | |
| Action completion | % of Action Queue items completed or dismissed within 7 days | ≥ 40% | | | |
| Inbox clear rate | % of uncategorized inbox items resolved within 48h | ≥ 50% | | | |
| Command palette usage | Sessions with ≥1 ⌘K open / total app sessions | ≥ 15% | | | |
| Hub findability | % of leaf page visits that used hub nav, breadcrumbs, or palette (not deep link only) | Track | | | |
| Empty→action | % of empty states that receive a primary CTA click within session | ≥ 25% | | | |
| Error recovery | % of page errors followed by retry or successful navigation within 2 min | ≥ 70% | | | |
| Tour completion | % of new users dismissing guided tour via Done (not Skip) | ≥ 30% | | | |

## Checklist

- [ ] Spot-check Command home: Action Queue, Weekly digest preview, inbox badge
- [ ] Spot-check ⌘K: Pages / Actions / Recent sections, focus trap, Esc
- [ ] Mobile More drawer: Money / Plan / Long-term / Setup section headers
- [ ] Leaf pages: breadcrumbs + PageContextBanner related links (transactions, budgets, net-worth, retirement)
- [ ] Transactions saved views: All / Uncategorized / This month / Large
- [ ] Time range selector syncs `?range=` in URL
- [ ] Demo mode + privacy blur toggles in Settings
- [ ] Design-system + journey e2e smoke green in CI
- [ ] Note any a11y regressions (axe when `@axe-core/playwright` is added)

## Ritual

1. Fill WVA table from analytics / product events.
2. File at most one UX improvement ticket.
3. Archive filled table in wiki or `#ops-scorecard`.
