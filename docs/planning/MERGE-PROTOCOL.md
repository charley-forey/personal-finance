# Merge Protocol

## Order

1. `agent/audit-*` (docs only)
2. `agent/plan-synthesis`
3. `agent/schema-*` (Schema Steward first)
4. `agent/events-*`, `agent/shared-*`
5. Backend `agent/*` domain branches (rebase between merges)
6. Intelligence packages
7. Frontend page branches
8. `agent/integrator` (X01/X02)
9. Hardening (H01–H03)

## Rules

- One agent = one PR = one write boundary
- Never `git add .` — stage owned paths only
- Schema Steward sole writer for `packages/database/**`
- Integrator sole writer for `api.ts`, `use-finance.ts`, `app-shell.tsx`, `app.module.ts`

## Conflict resolution

Stop → MR-01 Merge Resolver → single integration commit → rebase branches

## PR template fields

Agent ID, Wave, WP-ID, boundary attestation, depends on PR #, tests run, conflicts list
