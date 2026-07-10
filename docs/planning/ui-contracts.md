# UI Contracts

## Shared components (Integrator X02 owns)

- `StatCard` — use `@/components/ui/stat-card` only (app-shell variant removed)
- `Card` — `@/components/ui/card`
- `PageHeader` — `@/components/ui/page-header` (supports `backHref` / `breadcrumbs`)
- `DataTable` — `@/components/ui/data-table`
- `Button` / `Input` / `Select` / `Modal` / `Badge` / `EmptyState` / `Skeleton` — `@/components/ui`
- `ActionQueue` — `@/components/action-queue` (Command home)
- Visual catalog — `/app/library/design-system` (`DesignSystemCatalog`)

## Page-local components

Agents may create `<page>/components/*` within their page folder only.

## Design tokens

Use Tailwind tokens from `globals.css`:

- `text-muted` (alias: `text-muted-foreground`)
- `border-card-border` (alias: `border-border`)
- `bg-card`, `bg-background`, `text-foreground`, `text-primary`, `text-danger`

Prefer canonical names (`text-muted`, `border-card-border`) in new code.

## Navigation

Single source of truth: `@/lib/nav-config` (`HUB_NAV`, `MOBILE_NAV`, `hubActive`, breadcrumbs).
Do not hardcode hub leaf maps in `app-shell.tsx`.
