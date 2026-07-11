'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Input, Button } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminUsersPage() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-users', submitted],
    queryFn: () => adminApi.users({ q: submitted || undefined }),
  });

  return (
    <div className="space-y-4">
      <AppPageHeader title="Users" description="Cross-tenant user directory." />
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(q);
        }}
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Email or name" />
        <Button type="submit">Search</Button>
      </form>
      {isLoading && <PageLoading variant="table" />}
      {isError && <PageError message={(error as Error).message} onRetry={() => refetch()} />}
      {data && (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="p-3">Email</th>
                <th className="p-3">Name</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((u) => (
                <tr key={String(u.id)} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-3">
                    <Link className="text-primary hover:underline" href={`/app/admin/users/${u.id}`}>
                      {String(u.email)}
                    </Link>
                  </td>
                  <td className="p-3">{String(u.name ?? '—')}</td>
                  <td className="p-3 text-muted">{u.createdAt ? new Date(String(u.createdAt)).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
