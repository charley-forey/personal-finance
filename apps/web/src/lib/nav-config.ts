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

/** Leaf pages under each hub (used by hubActive, breadcrumbs, back links). */
const HUB_LEAVES: Record<string, { prefix?: string; exact?: string }[]> = {
  '/app': [
    { exact: '/app/inbox' },
    { exact: '/app/insights' },
    { exact: '/app/agents' },
    { exact: '/app/health' },
    { exact: '/app/notifications' },
  ],
  '/app/cash-flow': [
    { prefix: '/app/accounts' },
    { prefix: '/app/transactions' },
    { exact: '/app/subscriptions' },
    { exact: '/app/income' },
    { exact: '/app/expenses' },
    { exact: '/app/activity' },
    { exact: '/app/calendar' },
  ],
  '/app/plan': [
    { prefix: '/app/budgets' },
    { prefix: '/app/pnl' },
    { prefix: '/app/goals' },
    { prefix: '/app/rules' },
  ],
  '/app/wealth': [
    { prefix: '/app/net-worth' },
    { prefix: '/app/investments' },
    { prefix: '/app/assets' },
    { prefix: '/app/equity' },
    { prefix: '/app/forecasts' },
  ],
  '/app/future': [
    { prefix: '/app/retirement' },
    { prefix: '/app/fire' },
    { prefix: '/app/debt' },
    { prefix: '/app/credit' },
    { prefix: '/app/taxes' },
    { prefix: '/app/life-plans' },
    { prefix: '/app/scenarios' },
  ],
  '/app/library': [
    { prefix: '/app/learn' },
    { prefix: '/app/documents' },
    { prefix: '/app/onboarding' },
    { prefix: '/app/library' },
  ],
};

/** Human-readable labels for leaf (and hub) routes. */
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
};

export const HUB_NAV: NavItem[] = [
  { href: '/app', label: 'Command', icon: 'LayoutDashboard' },
  { href: '/app/cash-flow', label: 'Cash Flow', icon: 'Wallet' },
  { href: '/app/plan', label: 'Plan', icon: 'PieChart' },
  { href: '/app/wealth', label: 'Wealth', icon: 'TrendingUp' },
  { href: '/app/future', label: 'Future', icon: 'Target' },
  { href: '/app/library', label: 'Library', icon: 'FileText' },
];

export const COMMAND_LINKS: NavItem[] = [
  { href: '/app/inbox', label: 'Inbox', icon: 'Inbox' },
  { href: '/app/insights', label: 'Insights', icon: 'TrendingUp' },
  { href: '/app/agents', label: 'Agents', icon: 'Bot' },
  { href: '/app/health', label: 'Health', icon: 'Shield' },
  { href: '/app/notifications', label: 'Notifications', icon: 'Bell' },
  { href: '/app/settings', label: 'Settings', icon: 'Settings' },
];

/** Mobile primary tabs — Inbox promoted for findability. */
export const MOBILE_NAV: MobileNavItem[] = [
  { href: '/app', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/app/cash-flow', label: 'Cash', icon: 'Wallet' },
  { href: '/app/inbox', label: 'Inbox', icon: 'Inbox' },
  { href: '/app/plan', label: 'Plan', icon: 'PieChart' },
  { href: '#more', label: 'More', icon: 'MoreHorizontal', opensMore: true },
];

export interface MoreSection {
  title: string;
  links: NavItem[];
}

/** Grouped More drawer sections (Money / Plan / Long-term / Setup). */
export const MORE_SECTIONS: MoreSection[] = [
  {
    title: 'Money',
    links: [
      { href: '/app/wealth', label: 'Wealth', icon: 'TrendingUp' },
      { href: '/app/accounts', label: 'Accounts', icon: 'Wallet' },
      { href: '/app/transactions', label: 'Transactions', icon: 'Wallet' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { href: '/app/budgets', label: 'Budgets', icon: 'PieChart' },
      { href: '/app/goals', label: 'Goals', icon: 'Target' },
      { href: '/app/rules', label: 'Rules', icon: 'Settings' },
    ],
  },
  {
    title: 'Long-term',
    links: [
      { href: '/app/future', label: 'Future', icon: 'Target' },
      { href: '/app/retirement', label: 'Retirement', icon: 'Target' },
      { href: '/app/scenarios', label: 'Scenarios', icon: 'Target' },
    ],
  },
  {
    title: 'Setup',
    links: [
      { href: '/app/library', label: 'Library', icon: 'FileText' },
      { href: '/app/onboarding', label: 'Setup', icon: 'FileText' },
      { href: '/app/settings', label: 'Settings', icon: 'Settings' },
      { href: '/app/insights', label: 'Insights', icon: 'TrendingUp' },
      { href: '/app/agents', label: 'Agents', icon: 'Bot' },
      { href: '/app/health', label: 'Health', icon: 'Shield' },
      { href: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    ],
  },
];

/** Flat More links (legacy consumers). */
export const MORE_LINKS: NavItem[] = MORE_SECTIONS.flatMap((s) => s.links);

function matchesLeaf(
  pathname: string,
  rules: { prefix?: string; exact?: string }[],
): boolean {
  return rules.some((rule) => {
    if (rule.exact) return pathname === rule.exact;
    if (rule.prefix) return pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`);
    return false;
  });
}

export function hubActive(pathname: string, href: string): boolean {
  if (href === '/app') {
    return pathname === '/app' || COMMAND_LINKS.some((l) => l.href === pathname);
  }
  const leaves = HUB_LEAVES[href];
  if (leaves) {
    return pathname === href || matchesLeaf(pathname, leaves);
  }
  return pathname === href;
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

function resolvePageLabel(pathname: string): string {
  const path = normalizePath(pathname);
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  // Dynamic segments e.g. /app/learn/[slug]
  const parent = path.split('/').slice(0, -1).join('/') || path;
  if (PAGE_LABELS[parent]) return PAGE_LABELS[parent];
  const segment = path.split('/').filter(Boolean).pop() ?? path;
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getHubForPath(pathname: string): NavItem | null {
  const path = normalizePath(pathname);
  for (const hub of HUB_NAV) {
    if (hubActive(path, hub.href)) return hub;
  }
  return null;
}

/** Hub + current page crumbs for leaf pages; single crumb on hub roots. */
export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const path = normalizePath(pathname);
  const hub = getHubForPath(path);
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
export function getHubBackLink(pathname: string): HubBackLink | null {
  const path = normalizePath(pathname);
  const hub = getHubForPath(path);
  if (!hub || path === hub.href) return null;
  return { href: hub.href, label: `Back to ${hub.label}` };
}

/** Flat list of navigable pages for the command palette. */
export function getAllNavPages(): NavItem[] {
  const seen = new Set<string>();
  const pages: NavItem[] = [];

  const add = (item: NavItem) => {
    if (seen.has(item.href) || item.href.startsWith('#')) return;
    seen.add(item.href);
    pages.push(item);
  };

  for (const hub of HUB_NAV) add(hub);
  for (const link of COMMAND_LINKS) add(link);

  for (const [href, label] of Object.entries(PAGE_LABELS)) {
    if (href === '/app' || href.startsWith('/app/library/')) continue;
    const hub = getHubForPath(href);
    if (!hub || href === hub.href) continue;
    add({
      href,
      label,
      icon: hub.icon,
    });
  }

  return pages;
}
