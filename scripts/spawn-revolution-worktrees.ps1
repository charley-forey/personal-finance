# Spawn Wave 10 revolution worktrees from planning/multi-agent-roadmap
param(
  [string]$BaseBranch = "planning/multi-agent-roadmap",
  [string]$ParentDir = ".."
)

$agents = @(
  @{ id = "rev-graph"; branch = "agent/rev-graph" },
  @{ id = "rev-context"; branch = "agent/rev-context" },
  @{ id = "rev-narrative"; branch = "agent/rev-narrative" },
  @{ id = "hub-cash-flow"; branch = "agent/hub-cash-flow" },
  @{ id = "hub-plan"; branch = "agent/hub-plan" },
  @{ id = "hub-wealth"; branch = "agent/hub-wealth" },
  @{ id = "hub-future"; branch = "agent/hub-future" },
  @{ id = "hub-library"; branch = "agent/hub-library" },
  @{ id = "rev-dashboard"; branch = "agent/rev-dashboard" },
  @{ id = "rev-transactions"; branch = "agent/rev-transactions" },
  @{ id = "rev-budgets"; branch = "agent/rev-budgets" },
  @{ id = "rev-insights"; branch = "agent/rev-insights" },
  @{ id = "rev-debt"; branch = "agent/rev-debt" },
  @{ id = "rev-net-worth"; branch = "agent/rev-net-worth" },
  @{ id = "rev-retirement"; branch = "agent/rev-retirement" },
  @{ id = "rev-inbox"; branch = "agent/rev-inbox" }
)

foreach ($a in $agents) {
  $path = Join-Path $ParentDir "pf-$($a.id)"
  if (Test-Path $path) {
    Write-Host "Skip existing: $path"
    continue
  }
  Write-Host "Creating worktree: $path -> $($a.branch)"
  git worktree add $path -b $a.branch $BaseBranch
}

Write-Host "Done. See docs/planning/revolution/AGENT-REGISTRY-R10.md"
