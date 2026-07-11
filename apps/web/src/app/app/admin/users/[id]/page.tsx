'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminUserDetailPage() {
  const id = String(useParams().id);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.user(id),
  });

  if (isLoading) return <PageLoading />;
  if (isError || !data) return <PageError message={(error as Error)?.message ?? 'Not found'} onRetry={() => refetch()} />;

  const user = data.user as Record<string, unknown>;
  const memberships = (data.memberships as Array<Record<string, unknown>>) ?? [];

  return (
    <div className="space-y-4">
      <AppPageHeader title={String(user.email)} description={String(user.name ?? id)} />
      <Badge variant={data.onboardingCompleted ? 'success' : 'warning'}>
        Onboarding {data.onboardingCompleted ? 'complete' : 'incomplete'}
      </Badge>
      <Card className="p-4">
        <h3 className="font-medium mb-3">Memberships</h3>
        <ul className="space-y-2 text-sm">
          {memberships.map((m) => (
            <li key={String(m.orgId)}>
              <Link className="text-primary hover:underline" href={`/app/admin/orgs/${m.orgId}`}>
                {String(m.orgName)}
              </Link>{' '}
              · <Badge>{String(m.role)}</Badge> · {String(m.planTier)} · {String(m.status)}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-4">
        <h3 className="font-medium mb-2">Preferences</h3>
        <pre className="text-xs overflow-auto text-muted">{JSON.stringify(data.preferences, null, 2)}</pre>
      </Card>
    </div>
  );
}
