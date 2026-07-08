'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
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
} from 'lucide-react';

const NAV = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/accounts', label: 'Accounts', icon: Wallet },
  { href: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/app/income', label: 'Income', icon: TrendingUp },
  { href: '/app/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/app/pnl', label: 'P&L', icon: FileText },
  { href: '/app/budgets', label: 'Budgets', icon: PieChart },
  { href: '/app/investments', label: 'Investments', icon: TrendingUp },
  { href: '/app/credit', label: 'Credit', icon: CreditCard },
  { href: '/app/net-worth', label: 'Net Worth', icon: TrendingUp },
  { href: '/app/forecasts', label: 'Forecasts', icon: Calculator },
  { href: '/app/retirement', label: 'Retirement', icon: Target },
  { href: '/app/fire', label: 'FIRE', icon: Flame },
  { href: '/app/taxes', label: 'Taxes', icon: FileText },
  { href: '/app/debt', label: 'Debt', icon: CreditCard },
  { href: '/app/goals', label: 'Goals', icon: Target },
  { href: '/app/insights', label: 'Insights', icon: TrendingUp },
  { href: '/app/agents', label: 'Agents', icon: Bot },
  { href: '/app/inbox', label: 'Inbox', icon: Inbox },
  { href: '/app/health', label: 'Health Score', icon: Shield },
  { href: '/app/assets', label: 'Assets', icon: Building2 },
  { href: '/app/documents', label: 'Documents', icon: FileText },
  { href: '/app/notifications', label: 'Notifications', icon: Inbox },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-card-border bg-card p-4 flex flex-col gap-1 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4">
          <Home className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">Finance OS</span>
        </Link>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground hover:bg-white/5',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

export function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border border-card-border bg-card p-6', className)}>
      {title && <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
      {change && <p className="text-xs text-primary mt-1">{change}</p>}
    </Card>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted mt-2">{description}</p>}
    </div>
  );
}
