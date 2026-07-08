'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, DataTable, EmptyState, StatCard } from '@/components/ui';
import { api, formatCurrency, type BillEvent } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function CalendarPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bill-calendar'],
    queryFn: () => api.billCalendar(),
  });

  const eventsByDate = (data?.events ?? []).reduce<Record<string, BillEvent[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div>
      <PageHeader
        title="Bill Calendar"
        description="Recurring bills and debt payments over the next 30 days"
      />

      {error && <PageError message={error.message} />}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {isLoading ? (
          <PageLoading variant="stats" count={2} />
        ) : (
          <>
            <StatCard title="Total Due (30 days)" value={formatCurrency(data?.totalDue ?? 0)} />
            <StatCard title="Upcoming Bills" value={String(data?.events.length ?? 0)} />
          </>
        )}
      </div>

      {isLoading && <PageLoading variant="list" count={4} className="mb-8" />}

      {!isLoading && sortedDates.length > 0 && (
        <div className="space-y-4 mb-8">
          {sortedDates.map((date) => (
            <Card key={date} title={formatDate(date)}>
              <div className="space-y-2">
                {eventsByDate[date]!.map((event) => (
                  <div key={`${event.sourceId}-${event.type}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{event.label}</span>
                      <Badge variant={event.type === 'recurring' ? 'default' : 'warning'}>
                        {event.type}
                      </Badge>
                    </div>
                    <span className="tabular-nums font-medium">{formatCurrency(event.amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && data?.events.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No bills due"
          description="No recurring bills or debt payments due in the next 30 days."
        />
      )}

      {!isLoading && data && data.events.length > 0 && (
        <DataTable
          data={data.events}
          keyExtractor={(e) => `${e.sourceId}-${e.date}-${e.type}`}
          emptyMessage="No bills due in the next 30 days."
          columns={[
            { key: 'date', header: 'Date', render: (e) => formatDate(e.date) },
            { key: 'label', header: 'Description' },
            {
              key: 'type',
              header: 'Type',
              render: (e) => (
                <Badge variant={e.type === 'recurring' ? 'default' : 'warning'}>{e.type}</Badge>
              ),
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (e) => formatCurrency(e.amount),
            },
          ]}
        />
      )}
    </div>
  );
}
