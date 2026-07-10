## Summary

<!-- What changed and why (1–3 bullets). -->

-

## UX contract checklist

Confirm for user-facing surfaces touched in this PR:

- [ ] **Loading** — Skeleton / PageLoading while data fetches; no blank flash
- [ ] **Empty** — EmptyState with clear next action (link bank, create budget, etc.)
- [ ] **Error** — PageError (or equivalent) with recoverable messaging
- [ ] **Provenance** — Sensitive metrics show source / sync / methodology when applicable
- [ ] **Breadcrumb / hub** — Leaf pages use AppPageHeader wayfinding or hub back link
- [ ] **a11y** — Focusable controls, labels, Esc/focus trap on dialogs/drawers; keyboard path for primary actions

## Test plan

- [ ] Manual smoke of changed routes (desktop + mobile width)
- [ ] `npm run test:e2e -w @pf/web` (or affected Playwright specs)
- [ ] Typecheck / lint for touched packages
