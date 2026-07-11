/** Single source of truth for app navigation (hubs, leaves, mobile tabs). */

export type NavIconName =
  | 'LayoutDashboard'
  | 'Wallet'
  | 'PieChart'
  | 'TrendingUp'
  | 'Target'
  | 'FileText'
  | 'Inbox'
  | 'Bot'
  | 'Shield'
  | 'Settings'
  | 'Bell'
  | 'Menu'
  | 'MoreHorizontal';

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
}

export interface HubNavItem extends NavItem {
  children: NavItem[];
}

export interface MobileNavItem extends NavItem {
  /** When true, shell opens the drawer instead of navigating */
  opensMore?: boolean;
}

export interface HubBackLink {
  href: string;
  label: string;
}

export interface Breadcrumb {
  href?: string;
  label: string;
}

/** Human-readable labels for leaf (and hub) routes — dynamic segments fall back here. */
const PAGE_LABELS: Record<string, string> = {
  '/app': 'Command',
  '/app/inbox': 'Inbox',
  '/app/insights': 'Insights',
  '/app/agents': 'Agents',
  '/app/health': 'Health',
  '/app/notifications': 'Notifications',
  '/app/settings': 'Settings',
  '/app/cash-flow': 'Cash Flow',
  '/app/accounts': 'Accounts',
  '/app/transactions': 'Transactions',
  '/app/subscriptions': 'Subscriptions',
  '/app/income': 'Income',
  '/app/expenses': 'Expenses',
  '/app/activity': 'Activity',
  '/app/calendar': 'Bill Calendar',
  '/app/plan': 'Plan',
  '/app/budgets': 'Budgets',
  '/app/pnl': 'P&L',
  '/app/goals': 'Goals',
  '/app/rules': 'Rules',
  '/app/wealth': 'Wealth',
  '/app/net-worth': 'Net Worth',
  '/app/investments': 'Investments',
  '/app/assets': 'Assets',
  '/app/equity': 'Equity',
  '/app/forecasts': 'Forecasts',
  '/app/future': 'Future',
  '/app/retirement': 'Retirement',
  '/app/fire': 'FIRE',
  '/app/debt': 'Debt',
  '/app/credit': 'Credit',
  '/app/taxes': 'Taxes',
  '/app/life-plans': 'Life Plans',
  '/app/scenarios': 'Scenarios',
  '/app/library': 'Library',
  '/app/learn': 'Learn',
  '/app/documents': 'Documents',
  '/app/onboarding': 'Setup',
  '/app/library/design-system': 'Design System',
  '/app/admin': 'Control Plane',
  '/app/admin/orgs': 'Organizations',
  '/app/admin/users': 'Users',
  '/app/admin/billing': 'FinOps',
  '/app/admin/flags': 'Feature Flags',
  '/app/admin/ops': 'Reliability',
  '/app/admin/trust': 'Trust',
  '/app/admin/support': 'Support',
  '/app/admin/ai': 'AI Ops',
  '/app/admin/scale': 'Scale',
  '/app/admin/search': 'Search',
};

/** Prefix-match children (nested routes under the leaf). Exact-only otherwise. */
const PREFIX_CHILDREN = new Set([
  '/app/accounts',
  '/app/transactions',
  '/app/budgets',
  '/app/pnl',
  '/app/goals',
  '/app/rules',
  '/app/net-worth',
  '/app/investments',
  '/app/assets',
  '/app/equity',
  '/app/forecasts',
  '/app/retirement',
  '/app/fire',
  '/app/debt',
  '/app/credit',
  '/app/taxes',
  '/app/life-plans',
  '/app/scenarios',
  '/app/learn',
  '/app/documents',
  '/app/onboarding',
  '/app/library',
  '/app/admin',
]);

export const HUB_NAV: HubNavItem[] = [
  {
    href: '/app',
    label: 'Command',
    icon: 'LayoutDashboard',
    children: [
      { href: '/app/inbox', label: 'Inbox', icon: 'Inbox' },
      { href: '/app/insights', label: 'Insights', icon: 'TrendingUp' },
      { href: '/app/agents', label: 'Agents', icon: 'Bot' },
      { href: '/app/health', label: 'Health', icon: 'Shield' },
      { href: '/app/notifications', label: 'Notifications', icon: 'Bell' },
      { href: '/app/settings', label: 'Settings', icon: 'Settings' },
    ],
  },
  {
    href: '/app/cash-flow',
    label: 'Cash Flow',
    icon: 'Wallet',
    children: [
      { href: '/app/accounts', label: 'Accounts', icon: 'Wallet' },
      { href: '/app/transactions', label: 'Transactions', icon: 'Wallet' },
      { href: '/app/subscriptions', label: 'Subscriptions', icon: 'Wallet' },
      { href: '/app/income', label: 'Income', icon: 'Wallet' },
      { href: '/app/expenses', label: 'Expenses', icon: 'Wallet' },
      { href: '/app/activity', label: 'Activity', icon: 'Wallet' },
      { href: '/app/calendar', label: 'Bill Calendar', icon: 'Wallet' },
    ],
  },
  {
    href: '/app/plan',
    label: 'Plan',
    icon: 'PieChart',
    children: [
      { href: '/app/budgets', label: 'Budgets', icon: 'PieChart' },
      { href: '/app/pnl', label: 'P&L', icon: 'PieChart' },
      { href: '/app/goals', label: 'Goals', icon: 'Target' },
      { href: '/app/rules', label: 'Rules', icon: 'Settings' },
    ],
  },
  {
    href: '/app/wealth',
    label: 'Wealth',
    icon: 'TrendingUp',
    children: [
      { href: '/app/net-worth', label: 'Net Worth', icon: 'TrendingUp' },
      { href: '/app/investments', label: 'Investments', icon: 'TrendingUp' },
      { href: '/app/assets', label: 'Assets', icon: 'TrendingUp' },
      { href: '/app/equity', label: 'Equity', icon: 'TrendingUp' },
      { href: '/app/forecasts', label: 'Forecasts', icon: 'TrendingUp' },
    ],
  },
  {
    href: '/app/future',
    label: 'Future',
    icon: 'Target',
    children: [
      { href: '/app/retirement', label: 'Retirement', icon: 'Target' },
      { href: '/app/fire', label: 'FIRE', icon: 'Target' },
      { href: '/app/debt', label: 'Debt', icon: 'Target' },
      { href: '/app/credit', label: 'Credit', icon: 'Target' },
      { href: '/app/taxes', label: 'Taxes', icon: 'Target' },
      { href: '/app/life-plans', label: 'Life Plans', icon: 'Target' },
      { href: '/app/scenarios', label: 'Scenarios', icon: 'Target' },
    ],
  },
  {
    href: '/app/library',
    label: 'Library',
    icon: 'FileText',
    children: [
      { href: '/app/learn', label: 'Learn', icon: 'FileText' },
      { href: '/app/documents', label: 'Documents', icon: 'FileText' },
      { href: '/app/onboarding', label: 'Setup', icon: 'FileText' },
    ],
  },
];

/** Platform Control Plane hub — append only for platform admins. */
export const ADMIN_HUB: HubNavItem = {
  href: '/app/admin',
  label: 'Control Plane',
  icon: 'Shield',
  children: [
    { href: '/app/admin/orgs', label: 'Organizations', icon: 'Shield' },
    { href: '/app/admin/users', label: 'Users', icon: 'Shield' },
    { href: '/app/admin/billing', label: 'FinOps', icon: 'Shield' },
    { href: '/app/admin/flags', label: 'Flags', icon: 'Shield' },
    { href: '/app/admin/ops', label: 'Reliability', icon: 'Shield' },
    { href: '/app/admin/trust', label: 'Trust', icon: 'Shield' },
    { href: '/app/admin/support', label: 'Support', icon: 'Shield' },
    { href: '/app/admin/ai', label: 'AI Ops', icon: 'Shield' },
    { href: '/app/admin/scale', label: 'Scale', icon: 'Shield' },
  ],
};

export function getHubNav(includeAdmin = false): HubNavItem[] {
  return includeAdmin ? [...HUB_NAV, ADMIN_HUB] : HUB_NAV;
}

/** @deprecated Use HUB_NAV[0].children or getHubChildren('/app') */
export const COMMAND_LINKS: NavItem[] = HUB_NAV[0].children;

/** Mobile primary tabs — Inbox promoted for findability. */
export const MOBILE_NAV: MobileNavItem[] = [
  { href: '/app', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/app/cash-flow', label: 'Cash', icon: 'Wallet' },
  { href: '/app/inbox', label: 'Inbox', icon: 'Inbox' },
  { href: '/app/plan', label: 'Plan', icon: 'PieChart' },
  { href: '#more', label: 'More', icon: 'MoreHorizontal', opensMore: true },
];

/** @deprecated Mobile drawer uses HUB_NAV accordions — do not add a parallel tree. */
export interface MoreSection {
  title: string;
  links: NavItem[];
}

/** @deprecated */
export const MORE_SECTIONS: MoreSection[] = [];

/** @deprecated */
export const MORE_LINKS: NavItem[] = HUB_NAV.flatMap((h) => h.children);

export function getHubChildren(hubHref: string): NavItem[] {
  return HUB_NAV.find((h) => h.href === hubHref)?.children ?? [];
}

function childMatches(pathname: string, childHref: string): boolean {
  if (PREFIX_CHILDREN.has(childHref)) {
    return pathname === childHref || pathname.startsWith(`${childHref}/`);
  }
  return pathname === childHref;
}

export function hubActive(pathname: string, href: string, hubs: HubNavItem[] = HUB_NAV): boolean {
  const path = normalizePath(pathname);
  const hub = hubs.find((h) => h.href === href);
  if (!hub) return path === href;
  if (path === hub.href) return true;
  return hub.children.some((c) => childMatches(path, c.href));
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

function resolvePageLabel(pathname: string): string {
  const path = normalizePath(pathname);
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  const parent = path.split('/').slice(0, -1).join('/') || path;
  if (PAGE_LABELS[parent]) return PAGE_LABELS[parent];
  const segment = path.split('/').filter(Boolean).pop() ?? path;
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getHubForPath(pathname: string, hubs: HubNavItem[] = HUB_NAV): HubNavItem | null {
  const path = normalizePath(pathname);
  for (const hub of hubs) {
    if (hubActive(path, hub.href, hubs)) return hub;
  }
  return null;
}

/** Hub + current page crumbs for leaf pages; single crumb on hub roots. */
export function getBreadcrumbs(pathname: string, hubs: HubNavItem[] = HUB_NAV): Breadcrumb[] {
  const path = normalizePath(pathname);
  const hub = getHubForPath(path, hubs);
  if (!hub) return [{ label: resolvePageLabel(path) }];

  if (path === hub.href) {
    return [{ label: hub.label }];
  }

  return [
    { href: hub.href, label: hub.label },
    { label: resolvePageLabel(path) },
  ];
}

/** Back link for leaf pages; null on hub roots. */
export function getHubBackLink(pathname: string, hubs: HubNavItem[] = HUB_NAV): HubBackLink | null {
  const path = normalizePath(pathname);
  const hub = getHubForPath(path, hubs);
  if (!hub || path === hub.href) return null;
  return { href: hub.href, label: `Back to ${hub.label}` };
}

export function isNavLeafActive(pathname: string, href: string): boolean {
  return childMatches(normalizePath(pathname), href);
}

/** Flat list of navigable pages for the command palette. */
export function getAllNavPages(includeAdmin = false): NavItem[] {
  const seen = new Set<string>();
  const pages: NavItem[] = [];

  const add = (item: NavItem) => {
    if (seen.has(item.href) || item.href.startsWith('#')) return;
    seen.add(item.href);
    pages.push(item);
  };

  for (const hub of getHubNav(includeAdmin)) {
    add(hub);
    for (const child of hub.children) add(child);
  }

  return pages;
}
