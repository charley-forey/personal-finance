# Orchestrator Runbook — Personal Finance OS Multi-Agent System

## Overview

This runbook governs parallel agent execution via git worktrees and the `planning/multi-agent-roadmap` branch.

## Session Map

| Session | Agent ID | Role | Worktree |
|---------|----------|------|----------|
| 0 | ORCH | Orchestrator | `charley-forey` |
| 1-10 | A01-A10 | Wave 1 audits | `pf-audit-*` |
| 11 | A11 | Synthesizer | `pf-plan-synthesis` |
| 12+ | B/F/I/E/X/P/H | Build waves 2-9 | Per AGENT-PROMPT-PACK |

## Pre-Flight Checklist

- [ ] `main` has clean committed baseline
- [ ] `planning/multi-agent-roadmap` branch created
- [ ] `docs/planning/` tree exists
- [ ] AGENT-REGISTRY.md and AGENT-STATUS.md initialized
- [ ] Worktrees created (or branch-only mode documented)

## Wave Execution

### Wave 1 (Audits)
- 10 agents write **only** `docs/planning/audits/audit-<domain>.md`
- Commit prefix: `[agent:audit-<domain>]`
- Merge order: any (unique files)

### Wave 2 (Foundation)
- **Sequential:** B01 Schema → B02 Events → B03 Shared → B04 Migration Validator
- Gate: `npm run db:push`, publish `schema-contracts.md`

### Waves 3-6 (Parallel within lane)
- Respect write boundaries in AGENT-PROMPT-PACK.md
- Rebase on latest `planning/multi-agent-roadmap` before PR

### Wave 7 (Integrator)
- **Only** X01/X02 may touch `api.ts`, `use-finance.ts`, `app-shell.tsx`, `app.module.ts`

### Wave 9 (Hardening)
- All intelligence features must pass gates in `INTELLIGENCE-QUALITY-GATES.md`

## Merge Protocol

1. Audit branches (docs only)
2. Synthesis branch
3. Schema Steward (always first code merge)
4. Events + Shared
5. Backend domains (one at a time, rebase between)
6. Intelligence packages
7. Frontend pages
8. Integrator
9. Hardening

## Conflict Escalation

1. Stop merge
2. Log blocker in AGENT-STATUS.md
3. Spawn MR-01 Merge Resolver with both diffs
4. Single resolution commit on `planning/merge-resolution-<date>`
5. Rebase affected branches

## Rollback

- Never force-push `main` or `planning/multi-agent-roadmap`
- `git revert <merge-commit>` to undo wave merge
- Abandon agent branch if needed; work is isolated per branch

## Quality Gates (every PR)

- `npm run build` passes
- Affected tests pass
- No edits outside write boundary
- No secrets in diff
- Orchestrator spot-check
