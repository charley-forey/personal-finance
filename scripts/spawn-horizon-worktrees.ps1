# Spawn Horizon X worktrees
param([string]$BaseBranch = "planning/multi-agent-roadmap", [string]$ParentDir = "..")
$agents = @("twin", "actions", "composer", "swarm", "mcp", "evolve")
foreach ($a in $agents) {
  $path = Join-Path $ParentDir "pf-$a"
  if (-not (Test-Path $path)) {
    git worktree add $path -b "agent/m-$a" $BaseBranch
  }
}
