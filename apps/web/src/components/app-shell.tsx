'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  FileText,
  Home,
  Menu,
  X,
  Inbox,
  Bot,
  Shield,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useInbox } from '@/hooks/use-finance';
import { Badge } from '@/components/ui';

const HUB_NAV = [
  { href: '/app', label: 'Command', icon: LayoutDashboard },
  { href: '/app/cash-flow', label: 'Cash Flow', icon: Wallet },
  { href: '/app/plan', label: 'Plan', icon: PieChart },
  { href: '/app/wealth', label: 'Wealth', icon: TrendingUp },
  { href: '/app/future', label: 'Future', icon: Target },
  { href: '/app/library', label: 'Library', icon: FileText },
];

const COMMAND_LINKS = [
  { href: '/app/inbox', label: 'Inbox', icon: Inbox },
  { href: '/app/insights', label: 'Insights', icon: TrendingUp },
  { href: '/app/agents', label: 'Agents', icon: Bot },
  { href: '/app/health', label: 'Health', icon: Shield },
  { href: '/app/notifications', label: 'Notifications', icon: Inbox },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

const MOBILE_NAV = [
  { href: '/app', label: 'Home', icon: LayoutDashboard },
  { href: '/app/cash-flow', label: 'Cash Flow', icon: Wallet },
  { href: '/app/plan', label: 'Plan', icon: PieChart },
  { href: '/app/future', label: 'Future', icon: Target },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  badge,
  indent,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
  badge?: number;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        indent && 'pl-9',
        active ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground hover:bg-white/5',
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="warning" className="ml-auto shrink-0">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

function hubActive(pathname: string, href: string) {
  if (href === '/app') return pathname === '/app' || COMMAND_LINKS.some((l) => l.href === pathname);
  if (href === '/app/cash-flow')
    return pathname === href || pathname.startsWith('/app/accounts') || pathname.startsWith('/app/transactions') || pathname === '/app/subscriptions' || pathname === '/app/income' || pathname === '/app/expenses' || pathname === '/app/activity' || pathname === '/app/calendar';
  if (href === '/app/plan')
    return pathname === href || pathname.startsWith('/app/budgets') || pathname.startsWith('/app/pnl') || pathname.startsWith('/app/goals') || pathname.startsWith('/app/rules');
  if (href === '/app/wealth')
    return pathname === href || pathname.startsWith('/app/net-worth') || pathname.startsWith('/app/investments') || pathname.startsWith('/app/assets') || pathname.startsWith('/app/equity') || pathname.startsWith('/app/forecasts');
  if (href === '/app/future')
    return pathname === href || pathname.startsWith('/app/retirement') || pathname.startsWith('/app/fire') || pathname.startsWith('/app/debt') || pathname.startsWith('/app/credit') || pathname.startsWith('/app/taxes') || pathname.startsWith('/app/life-plans') || pathname.startsWith('/app/scenarios');
  if (href === '/app/library')
    return pathname === href || pathname.startsWith('/app/learn') || pathname.startsWith('/app/documents') || pathname.startsWith('/app/onboarding') || pathname.startsWith('/app/settings');
  return pathname === href;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(true);
  const { data: inbox } = useInbox();
  const inboxCount = (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-card-border bg-card/95 backdrop-blur px-4 py-3 md:hidden">
        <Link href="/app" className="flex items-center gap-2 font-semibold">
          <Home className="w-5 h-5 text-primary" />
          Finance OS
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-white/5"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)} aria-hidden />
      )}

      <div className="flex min-h-[calc(100vh-3.5rem)] md:min-h-screen">
        <aside
          className={clsx(
            'fixed md:sticky top-14 md:top-0 z-30 h-[calc(100vh-3.5rem)] md:h-screen w-72 border-r border-card-border bg-card p-4 flex flex-col gap-1 overflow-y-auto transition-transform md:translate-x-0',
            menuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Link href="/" className="hidden md:flex items-center gap-2 px-3 py-4 mb-2">
            <Home className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">Finance OS</span>
          </Link>

          {HUB_NAV.map((item) => (
            <div key={item.href}>
              <NavLink
                {...item}
                active={hubActive(pathname ?? '', item.href)}
                onClick={() => setMenuOpen(false)}
                badge={item.href === '/app' ? inboxCount : undefined}
              />
              {item.href === '/app' && hubActive(pathname ?? '', '/app') && (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-1 text-xs text-muted hover:text-foreground"
                    onClick={() => setCommandOpen((v) => !v)}
                  >
                    <ChevronDown className={clsx('w-3 h-3 transition', commandOpen && 'rotate-180')} />
                    Command pages
                  </button>
                  {commandOpen &&
                    COMMAND_LINKS.map((link) => (
                      <NavLink
                        key={link.href}
                        {...link}
                        indent
                        active={pathname === link.href}
                        onClick={() => setMenuOpen(false)}
                        badge={link.href === '/app/inbox' ? inboxCount : undefined}
                      />
                    ))}
                </>
              )}
            </div>
          ))}
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-x-hidden">{children}</main>
      </div>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-card-border bg-card/95 backdrop-blur md:hidden safe-bottom">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const active = hubActive(pathname ?? '', href) || pathname === href;
            return (
              <Link
                key={href}
                href={href}
                prefetch
                className={clsx(
                  'flex flex-col items-center justify-center gap-1 py-2 text-[10px] sm:text-xs',
                  active ? 'text-primary' : 'text-muted',
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border border-card-border bg-card p-4 sm:p-6', className)}>
      {title && <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <Card>
      <p className="text-xs sm:text-sm text-muted">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold tabular-nums mt-1">{value}</p>
      {change && <p className="text-xs text-primary mt-1">{change}</p>}
    </Card>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted mt-1 sm:mt-2 text-sm sm:text-base">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
