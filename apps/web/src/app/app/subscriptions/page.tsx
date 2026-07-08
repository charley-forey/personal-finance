'use client';

import { Repeat } from 'lucide-react';
import { PageHeader } from '@/components/app-shell';
import { Badge, DataTable, EmptyState, Skeleton } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import { useRecurring } from '@/hooks/use-finance';
import { formatCurrency, type RecurringStream } from '@/lib/api';

const columns: DataTableColumn<RecurringStream>[] = [
  {
    key: 'description',
    header: 'Description',
    render: (r) => (
      <div>
        <p className="font-medium">{r.description ?? 'Unnamed subscription'}</p>
        {r.lastDate && <p className="text-xs text-muted">Last seen {r.lastDate}</p>}
      </div>
    ),
  },
  {
    key: 'frequency',
    header: 'Frequency',
    className: 'text-muted capitalize',
    render: (r) => r.frequency?.toLowerCase() ?? '—',
  },
  {
    key: 'averageAmount',
    header: 'Avg Amount',
    className: 'text-right tabular-nums font-medium',
    headerClassName: 'text-right',
    render: (r) => formatCurrency(parseFloat(r.averageAmount ?? '0')),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (r) => (
      <Badge variant={r.isActive ? 'success' : 'default'}>
        {r.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];

export default function SubscriptionsPage() {
  const { data: streams, isLoading, error } = useRecurring();

  const active = (streams ?? []).filter((s) => s.isActive);
  const inactive = (streams ?? []).filter((s) => !s.isActive);

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Recurring income and expenses detected from your accounts"
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
      ) : (streams ?? []).length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No subscriptions detected"
          description="Link accounts and sync transactions to discover recurring payments."
        />
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">
                Active ({active.length})
              </h2>
              <DataTable
                columns={columns}
                data={active}
                keyExtractor={(r) => r.id}
              />
            </section>
          )}
          {inactive.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">
                Inactive ({inactive.length})
              </h2>
              <DataTable
                columns={columns}
                data={inactive}
                keyExtractor={(r) => r.id}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
