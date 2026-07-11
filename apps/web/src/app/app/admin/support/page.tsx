'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminSupportPage() {
  const playbooks = useQuery({ queryKey: ['admin-playbooks'], queryFn: () => adminApi.playbooks() });
  const cases = useQuery({ queryKey: ['admin-cases'], queryFn: () => adminApi.cases() });
  const [orgId, setOrgId] = useState('');
  const [subject, setSubject] = useState('');

  if (playbooks.isLoading) return <PageLoading />;
  if (playbooks.isError) return <PageError message={(playbooks.error as Error).message} />;

  return (
    <div className="space-y-6">
      <AppPageHeader title="Support workspace" description="Cases, playbooks, and impersonation entry points." />

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Create case</h3>
        <div className="flex flex-wrap gap-2">
          <Input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="Org ID" />
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="min-w-64" />
          <Button
            onClick={async () => {
              if (!orgId || !subject) return;
              await adminApi.createCase(orgId, { subject, playbookKey: 'bank_reconnect' });
              setSubject('');
              cases.refetch();
            }}
          >
            Create
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Playbooks</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {(playbooks.data ?? []).map((p) => (
            <div key={String(p.key)} className="rounded-lg border border-border p-3">
              <div className="font-medium">{String(p.title)}</div>
              <ol className="mt-2 list-decimal pl-4 text-sm text-muted space-y-1">
                {((p.steps as string[]) ?? []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="font-medium">Open cases</h3>
        <ul className="text-sm space-y-2">
          {(cases.data?.data ?? []).map((c) => (
            <li key={String(c.id)} className="flex justify-between gap-2 border-b border-border/40 pb-2">
              <span>
                <Badge>{String(c.status)}</Badge> {String(c.subject)} · org {String(c.orgId)}
              </span>
              {c.status !== 'closed' && (
                <Button size="sm" variant="ghost" onClick={() => adminApi.updateCase(String(c.id), 'closed').then(() => cases.refetch())}>
                  Close
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
