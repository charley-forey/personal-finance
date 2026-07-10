# Spawn UX agent worktrees from ux/foundation (or current HEAD).
# Usage: pwsh scripts/spawn-ux-worktrees.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$lanes = @(
  'journey',
  'nav',
  'trust',
  'a11y',
  'hub-command',
  'hub-cash',
  'hub-plan',
  'hub-wealth',
  'hub-future',
  'hub-library',
  'resilience',
  'quality',
  'productize'
)

New-Item -ItemType Directory -Force -Path (Join-Path $root '.worktrees') | Out-Null

foreach ($id in $lanes) {
  $branch = "ux/$id"
  $path = Join-Path $root ".worktrees\$id"
  if (Test-Path $path) {
    Write-Host "skip existing $path"
    continue
  }
  git worktree add -b $branch $path HEAD
  Write-Host "created $branch -> $path"
}

Write-Host "Done. See docs/planning/ux-agents/README.md"
