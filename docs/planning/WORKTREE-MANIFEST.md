# Worktree Manifest

Orchestrator executed worktree setup per multi-agent plan.

| Worktree | Branch | Path | Notes |
|----------|--------|------|-------|
| Main orchestrator | `planning/multi-agent-roadmap` | `charley-forey` | All planning + Wave 2 code |
| A01 sample | `agent/audit-foundation` | `../pf-audit-foundation` | Created; docs merged to planning branch |

**Branch-only mode:** Wave 1 audits were executed in-orchestrator (single session) and committed to `planning/multi-agent-roadmap` to avoid 10-way doc merge overhead. Additional worktrees can be spawned from AGENT-PROMPT-PACK for Waves 3-9.

```powershell
# Spawn backend agent example
git worktree add ..\pf-plaid-deep -b agent/plaid-deep planning/multi-agent-roadmap
```
