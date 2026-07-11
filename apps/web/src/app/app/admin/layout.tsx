'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { usePlatformAdmin } from '@/hooks/use-platform-admin';
import { PageLoading, PageError } from '@/components/page-states';
import { Badge, Button, Input } from '@/components/ui';
import { adminApi } from '@/lib/admin-api';

const LINKS = [
  { href: '/app/admin', label: 'Command Center' },
  { href: '/app/admin/orgs', label: 'Organizations' },
  { href: '/app/admin/users', label: 'Users' },
  { href: '/app/admin/billing', label: 'FinOps' },
  { href: '/app/admin/flags', label: 'Flags' },
  { href: '/app/admin/ops', label: 'Reliability' },
  { href: '/app/admin/trust', label: 'Trust' },
  { href: '/app/admin/support', label: 'Support' },
  { href: '/app/admin/ai', label: 'AI Ops' },
  { href: '/app/admin/scale', label: 'Scale' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isPlatformAdmin, isLoading, me, environment } = usePlatformAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [impersonation, setImpersonation] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!isPlatformAdmin) return;
    adminApi.activeImpersonation().then((r) => {
      setImpersonation(r.data?.[0] ?? null);
    }).catch(() => undefined);
  }, [isPlatformAdmin, pathname]);

  if (isLoading) return <PageLoading variant="cards" />;
  if (!isPlatformAdmin) {
    return (
      <PageError
        message="Platform admin access required. Confirm you are signed in as an allowlisted email, then refresh."
        onRetry={() => router.push('/app')}
      />
    );
  }

  return (
    <div className="space-y-4">
      {impersonation && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm flex items-center justify-between gap-3">
          <span>
            <strong>SUPPORT SESSION</strong> — viewing as org{' '}
            {String(impersonation.targetOrgId)} (expires {String(impersonation.expiresAt)})
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await adminApi.revokeImpersonation(String(impersonation.id));
              setImpersonation(null);
            }}
          >
            End session
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Control Plane</h1>
            <Badge variant="warning">{environment}</Badge>
            <Badge variant="default">{me?.role ?? 'admin'}</Badge>
          </div>
          <p className="text-sm text-muted mt-0.5">{me?.email}</p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) router.push(`/app/admin/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orgs, users, Stripe…"
            className="w-64"
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-border pb-2">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/app/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm transition-colors',
                active ? 'bg-primary/15 text-primary' : 'text-muted hover:text-foreground hover:bg-white/5',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
