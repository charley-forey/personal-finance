'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Activity,
  Repeat,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  PieChart,
  Target,
  Bot,
  FileText,
  Settings,
  CreditCard,
  Calculator,
  Home,
  Flame,
  Inbox,
  Shield,
  Building2,
  Menu,
  X,
  Calendar,
  FlaskConical,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useInbox } from '@/hooks/use-finance';
import { Badge } from '@/components/ui';

const NAV = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/accounts', label: 'Accounts', icon: Wallet },
  { href: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/app/activity', label: 'Activity', icon: Activity },
  { href: '/app/subscriptions', label: 'Subscriptions', icon: Repeat },
  { href: '/app/income', label: 'Income', icon: TrendingUp },
  { href: '/app/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/app/pnl', label: 'P&L', icon: FileText },
  { href: '/app/budgets', label: 'Budgets', icon: PieChart },
  { href: '/app/investments', label: 'Investments', icon: TrendingUp },
  { href: '/app/calendar', label: 'Bill Calendar', icon: Calendar },
  { href: '/app/scenarios', label: 'Scenarios', icon: FlaskConical },
  { href: '/app/rules', label: 'Rules', icon: Zap },
  { href: '/app/credit', label: 'Credit', icon: CreditCard },
  { href: '/app/net-worth', label: 'Net Worth', icon: TrendingUp },
  { href: '/app/forecasts', label: 'Forecasts', icon: Calculator },
  { href: '/app/retirement', label: 'Retirement', icon: Target },
  { href: '/app/fire', label: 'FIRE', icon: Flame },
  { href: '/app/taxes', label: 'Taxes', icon: FileText },
  { href: '/app/debt', label: 'Debt', icon: CreditCard },
  { href: '/app/goals', label: 'Goals', icon: Target },
  { href: '/app/equity', label: 'Equity', icon: TrendingUp },
  { href: '/app/life-plans', label: 'Life Plans', icon: Home },
  { href: '/app/insights', label: 'Insights', icon: TrendingUp },
  { href: '/app/agents', label: 'Agents', icon: Bot },
  { href: '/app/inbox', label: 'Inbox', icon: Inbox },
  { href: '/app/learn', label: 'Learn', icon: FileText },
  { href: '/app/onboarding', label: 'Setup', icon: Settings },
  { href: '/app/health', label: 'Health Score', icon: Shield },
  { href: '/app/assets', label: 'Assets', icon: Building2 },
  { href: '/app/documents', label: 'Documents', icon: FileText },
  { href: '/app/notifications', label: 'Notifications', icon: Inbox },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

const MOBILE_NAV = [
  { href: '/app', label: 'Home', icon: LayoutDashboard },
  { href: '/app/accounts', label: 'Accounts', icon: Wallet },
  { href: '/app/transactions', label: 'Activity', icon: ArrowLeftRight },
  { href: '/app/insights', label: 'Insights', icon: TrendingUp },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
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
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
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
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={() => setMenuOpen(false)}
              badge={item.href === '/app/inbox' ? inboxCount : undefined}
            />
          ))}
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-x-hidden">{children}</main>
      </div>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-card-border bg-card/95 backdrop-blur md:hidden safe-bottom">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
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
