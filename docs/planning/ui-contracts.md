# UI Contracts

## Shared components (Integrator X02 owns)

- `StatCard` — use `@/components/ui/stat-card` only (deprecate app-shell variant)
- `DataTable` — `@/components/ui/data-table`
- `ActionQueue` — `@/components/action-queue` (dashboard)

## Page-local components

Agents may create `<page>/components/*` within their page folder only.

## Design tokens

Use existing Tailwind tokens: `text-muted`, `border-card-border`, `bg-card`.
