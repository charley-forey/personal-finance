# UI Contracts

## Shared components (Integrator X02 owns)

- `StatCard` — use `@/components/ui/stat-card` only (app-shell variant removed)
- `Card` — `@/components/ui/card`
- `PageHeader` / `AppPageHeader` — `@/components/ui`
- `DataTable` — `@/components/ui/data-table` (`mobilePresentation`: `scroll` | `cards` | `priority`)
- `Button` / `Input` / `Select` / `Modal` / `Sheet` / `Badge` / `EmptyState` / `Skeleton` / `Toast` / `Tooltip` / `Tabs` / `SegmentedControl` / `Switch` — `@/components/ui`
- `ActionQueue` — `@/components/action-queue` (Command home)
- Visual catalog — `/app/library/design-system` (`DesignSystemCatalog`) — every kit export must appear here

## Page-local components

Agents may create `<page>/components/*` within their page folder only.

## Design tokens

Use Tailwind tokens from `globals.css`:

- `text-muted` (alias: `text-muted-foreground`)
- `border-card-border` (alias: `border-border`)
- `bg-card`, `bg-background`, `text-foreground`, `text-primary`, `text-danger`
- Semantic: `text-success`, `text-warning`, `text-info` (and matching bg/border where defined)
- Chart: `--chart-1` … `--chart-5`, `--chart-axis`, `--chart-grid`

Prefer canonical names (`text-muted`, `border-card-border`) in new code.

### Spacing / radius / breakpoints

| Role | Value |
|------|--------|
| Breakpoints | `sm` 640 · `md` 768 (shell split) · `lg` 1024 · `xl` 1280 |
| Page padding | `p-4 sm:p-6 lg:p-8` |
| Section stack | `space-y-6` default · `space-y-8` hubs |
| Radius | surfaces `rounded-xl` · controls `rounded-lg` |
| Touch | interactive ≥ `min-h-11` / 44px on coarse pointers |
| Density | `data-density="comfortable\|compact"` on `html` (comfortable default) |

### Z-index scale

| Layer | Z |
|-------|---|
| Backdrop | 30 |
| Drawer / header | 40 |
| Bottom nav | 40 |
| Tour / PWA | 50 |
| Palette / modal | 60 |
| Toast | 70 |

### Motion

CSS transitions only; honor `prefers-reduced-motion`.

## Navigation

Single source of truth: `@/lib/nav-config`.

- `HUB_NAV: HubNavItem[]` — each hub has `children: NavItem[]`
- `getHubChildren(hubHref)`, `hubActive`, `getBreadcrumbs`, `getAllNavPages`, `MOBILE_NAV`
- Do **not** hardcode hub leaf maps in `app-shell.tsx` or hub pages
- Desktop: hub row = accordion (label → hub landing, chevron → expand)
- Mobile: same accordion in drawer + bottom tabs (Home / Cash / Inbox / Plan / More); Search opens command palette
- No parallel `MORE_SECTIONS` tree; no global `PageContextBanner` / `EntityGraphPanel` on every page
