'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { AppPageHeader, Card, Badge } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

function SearchInner() {
  const sp = useSearchParams();
  const q = sp.get('q') ?? '';
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-search', q],
    queryFn: () => adminApi.search(q),
    enabled: Boolean(q),
  });

  if (!q) return <p className="text-sm text-muted">Enter a query in the Control Plane search box.</p>;
  if (isLoading) return <PageLoading />;
  if (isError) return <PageError message={(error as Error).message} />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Organizations</h3>
        {((data?.orgs as Array<Record<string, unknown>>) ?? []).map((o) => (
          <Link key={String(o.id)} href={`/app/admin/orgs/${o.id}`} className="block text-sm text-primary hover:underline">
            {String(o.name)} <Badge>{String(o.planTier)}</Badge>
          </Link>
        ))}
      </Card>
      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Users</h3>
        {((data?.users as Array<Record<string, unknown>>) ?? []).map((u) => (
          <Link key={String(u.id)} href={`/app/admin/users/${u.id}`} className="block text-sm text-primary hover:underline">
            {String(u.email)}
          </Link>
        ))}
      </Card>
      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Subscriptions</h3>
        <pre className="text-xs text-muted overflow-auto">{JSON.stringify(data?.subscriptions ?? [], null, 2)}</pre>
      </Card>
      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Plaid items</h3>
        <pre className="text-xs text-muted overflow-auto">{JSON.stringify(data?.plaidItems ?? [], null, 2)}</pre>
      </Card>
    </div>
  );
}

export default function AdminSearchPage() {
  return (
    <div className="space-y-4">
      <AppPageHeader title="Universal search" description="Orgs, users, Stripe IDs, Plaid items." />
      <Suspense fallback={<PageLoading />}>
        <SearchInner />
      </Suspense>
    </div>
  );
}
