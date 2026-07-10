# Agent briefs (quick)

Each lane owns only its paths. Read `docs/planning/ui-contracts.md` first.

## J01 journey
- Onboarding gate, prefs `onboardingCompleted`, journey write-backs, Action Queue empty CTA
- Paths: `onboarding/`, `onboarding-gate.tsx`, `journey.ts`, `action-queue.tsx`, plaid link

## N01 nav
- Palette, MORE_SECTIONS, hub chip, breadcrumbs via AppPageHeader
- Paths: `nav-config.ts`, `command-palette.tsx`, `app-shell.tsx`

## T01 trust
- ProvenanceChip, explain coverage, sample insight badges, editable assumptions
- Paths: `provenance-chip.tsx`, net-worth/budgets/debt/retirement/fire/health

## A01 a11y
- Modal/palette/PWA focus traps, PageError role=alert, journey SR labels
- Paths: `modal.tsx`, `page-states.tsx`, `pwa-install-prompt.tsx`, `hub-layout.tsx`

## H01–H06 hubs
- `firstJob` on HubLayout; leaf empty→value; inbox j/k + progress
- Paths: hub pages + leaf pages under that hub only

## R01 resilience
- DegradedModeBanner, ToastUndo, PlanLimitGate, PanelErrorBoundary
- Paths: those components + action-queue toast wiring

## Q01 quality
- `e2e/journey.spec.ts`, `hub-smoke.spec.ts`, UX-SCORECARD, PR template
- Paths: `apps/web/e2e/`, `docs/ops/UX-SCORECARD.md`, `.github/PULL_REQUEST_TEMPLATE.md`

## P01 productize
- TimeRangeProvider, GuidedTour, CategorizationCoach, DemoMode, WeeklyDigest, EntityDrawer
- Paths: those components + settings toggles + Command home
