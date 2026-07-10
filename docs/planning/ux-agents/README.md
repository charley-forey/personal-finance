# UX Multi-Agent Worktree Briefs

Branch base: `ux/foundation`

## Spawn (PowerShell)

```powershell
# From repo root, on ux/foundation
$lanes = @(
  @{ id = 'journey'; branch = 'ux/journey' },
  @{ id = 'nav'; branch = 'ux/nav' },
  @{ id = 'trust'; branch = 'ux/trust' },
  @{ id = 'a11y'; branch = 'ux/a11y' },
  @{ id = 'hub-command'; branch = 'ux/hub-command' },
  @{ id = 'hub-cash'; branch = 'ux/hub-cash' },
  @{ id = 'hub-plan'; branch = 'ux/hub-plan' },
  @{ id = 'hub-wealth'; branch = 'ux/hub-wealth' },
  @{ id = 'hub-future'; branch = 'ux/hub-future' },
  @{ id = 'hub-library'; branch = 'ux/hub-library' },
  @{ id = 'resilience'; branch = 'ux/resilience' },
  @{ id = 'quality'; branch = 'ux/quality' },
  @{ id = 'productize'; branch = 'ux/productize' }
)

foreach ($lane in $lanes) {
  $path = Join-Path (Get-Location) ".worktrees/$($lane.id)"
  if (-not (Test-Path $path)) {
    git worktree add -b $lane.branch $path HEAD
  }
}
```

Or run: `pwsh scripts/spawn-ux-worktrees.ps1`

## Merge order

1. `ux/foundation` (X00) — already current
2. `ux/journey` + `ux/a11y` (parallel)
3. `ux/nav` + `ux/trust` (parallel)
4. Hub lanes in batches: cash/plan → wealth/future → command/library
5. `ux/resilience` → `ux/quality` → `ux/productize`

## Contracts (all agents)

- Nav SoT: `apps/web/src/lib/nav-config.ts`
- UI kit: `apps/web/src/components/ui`
- Page chrome: `AppPageHeader` (auto breadcrumbs)
- States: `PageLoading` / `PageError` / `EmptyState`
- See `docs/planning/ui-contracts.md` and PR template UX checklist

## Lane ownership

| Lane | Owns | Must not touch |
|------|------|----------------|
| journey | Onboarding gate, Plaid success, journey write-back | Hub leaf redesigns |
| nav | Palette, mobile IA, cross-links | Metric formulas |
| trust | Provenance, explain, sync honesty | Auth/Plaid flows |
| a11y | Focus traps, ARIA, live regions | Visual redesign |
| hub-* | Per-hub leaf depth + empty→value | Cross-hub nav SoT |
| resilience | Degraded modes, undo, plan limits | Hub leaf redesigns |
| quality | E2E, scorecard, PR checks | Product features |
| productize | Time range, demo, tours, coach | Auth/Plaid core |

## Status

Waves 0–7 are implemented on the primary working tree (`ux/foundation` branch, uncommitted until you ask to commit).

Parallel worktrees under `.worktrees/*` were spawned from the last git commit for follow-up lane polish. After committing foundation, reset or recreate worktrees from the new tip:

```powershell
git worktree remove .worktrees/journey  # etc.
# then re-run scripts/spawn-ux-worktrees.ps1
```

Or merge foundation first, then `git -C .worktrees/journey merge ux/foundation`.
