'use client';

import { Repeat } from 'lucide-react';
import { AppPageHeader } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, DataTable, EmptyState, StatCard } from '@/components/ui';
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
  const monthlyTotal = active.reduce((sum, s) => sum + parseFloat(s.averageAmount ?? '0'), 0);

  return (
    <div>
      <AppPageHeader
        title="Subscriptions"
        description="Recurring income and expenses detected from your accounts"
      />

      {error && <PageError message={error.message} />}

      {isLoading ? (
        <PageLoading variant="table" count={4} />
      ) : (streams ?? []).length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No subscriptions detected"
          description="Link accounts and sync transactions to discover recurring payments."
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <StatCard title="Active" value={String(active.length)} />
            <StatCard title="Monthly Total" value={formatCurrency(monthlyTotal)} />
          </div>
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
