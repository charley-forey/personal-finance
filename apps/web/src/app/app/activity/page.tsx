'use client';

import { Activity } from 'lucide-react';
import { PageHeader } from '@/components/app-shell';
import { Badge, DataTable, EmptyState, Skeleton } from '@/components/ui';
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
      <PageHeader
        title="Activity"
        description="Recent changes across your financial data"
      />

      {error && (
        <p className="mb-4 text-sm text-red-400">{error.message}</p>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (events ?? []).length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Changes from syncs, edits, and imports will appear here."
        />
      ) : (
        <DataTable
          columns={columns}
          data={events ?? []}
          keyExtractor={(e) => e.id}
          emptyMessage="No activity recorded."
        />
      )}
    </div>
  );
}
