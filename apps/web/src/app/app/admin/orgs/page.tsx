'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Input, Button, Badge } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminOrgsPage() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-orgs', submitted],
    queryFn: () => adminApi.orgs({ q: submitted || undefined }),
  });

  return (
    <div className="space-y-4">
      <AppPageHeader title="Organizations" description="Customer 360 directory across all tenants." />
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(q);
        }}
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, id, Stripe…" />
        <Button type="submit">Search</Button>
      </form>
      {isLoading && <PageLoading variant="table" />}
      {isError && <PageError message={(error as Error).message} onRetry={() => refetch()} />}
      {data && (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="p-3">Name</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3">Members</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((org) => (
                <tr key={String(org.id)} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-3">
                    <Link className="text-primary hover:underline" href={`/app/admin/orgs/${org.id}`}>
                      {String(org.name)}
                    </Link>
                  </td>
                  <td className="p-3"><Badge>{String(org.planTier)}</Badge></td>
                  <td className="p-3"><Badge variant={org.status === 'active' ? 'success' : 'warning'}>{String(org.status)}</Badge></td>
                  <td className="p-3">{String(org.memberCount ?? 0)}</td>
                  <td className="p-3 text-muted">{org.createdAt ? new Date(String(org.createdAt)).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="p-3 text-xs text-muted">{data.total} total</p>
        </Card>
      )}
    </div>
  );
}
