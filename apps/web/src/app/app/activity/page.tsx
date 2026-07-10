'use client';

import { Activity } from 'lucide-react';
import { AppPageHeader } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, DataTable, EmptyState, StatCard } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import { useActivity } from '@/hooks/use-finance';
import type { ActivityEvent } from '@/lib/api';

const columns: DataTableColumn<ActivityEvent>[] = [
  {
    key: 'detectedAt',
    header: 'When',
    className: 'text-muted whitespace-nowrap',
    render: (e) => new Date(e.detectedAt).toLocaleString(),
  },
  {
    key: 'entityType',
    header: 'Entity',
    render: (e) => (
      <Badge variant="default" className="capitalize">
        {e.entityType.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    key: 'fieldName',
    header: 'Field',
    className: 'text-muted',
    render: (e) => e.fieldName?.replace(/_/g, ' ') ?? '—',
  },
  {
    key: 'changeSource',
    header: 'Source',
    render: (e) => (
      <Badge variant={e.changeSource === 'plaid' ? 'info' : 'primary'} className="capitalize">
        {e.changeSource}
      </Badge>
    ),
  },
];

export default function ActivityPage() {
  const { data: events, isLoading, error } = useActivity();

  return (
    <div>
      <AppPageHeader
        title="Activity"
        description="Recent changes across your financial data"
      />

      {error && <PageError message={error.message} />}

      {isLoading ? (
        <PageLoading variant="table" count={4} />
      ) : (events ?? []).length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Changes from syncs, edits, and imports will appear here."
        />
      ) : (
        <>
          <div className="mb-6 max-w-xs">
            <StatCard title="Recent Events" value={String(events?.length ?? 0)} />
          </div>
          <DataTable
            columns={columns}
            data={events ?? []}
            keyExtractor={(e) => e.id}
          />
        </>
      )}
    </div>
  );
}
