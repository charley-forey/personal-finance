'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card } from '@/components/app-shell';
import { Badge, DataTable, Skeleton } from '@/components/ui';
import { useHoldings } from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api, type Holding } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SLICE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export default function InvestmentsPage() {
  const formatCurrency = useFormatCurrency();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: allocation, isLoading: allocLoading } = useQuery({
    queryKey: ['portfolio-allocation'],
    queryFn: () => api.portfolioAllocation(),
  });

  const total = allocation?.total ?? (holdings ?? []).reduce((s, h) => s + parseFloat(h.institutionValue ?? '0'), 0);
  const isLoading = holdingsLoading || allocLoading;

  const pieData = (allocation?.slices ?? []).map((s) => ({
    name: s.name,
    value: s.value,
    percent: s.percent,
  }));

  return (
    <div>
      <PageHeader title="Investments" description="Portfolio holdings and allocation vs 60/25/15 target" />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <p className="text-sm text-muted">Total Portfolio Value</p>
          <p className="text-3xl font-bold tabular-nums mt-1">{formatCurrency(total)}</p>
          {allocation && (
            <p className="text-sm text-muted mt-2">
              Drift score: <span className="text-foreground font-medium">{allocation.driftScore.toFixed(1)}%</span>
              {allocation.driftScore > 10 && (
                <Badge variant="warning" className="ml-2">Rebalance suggested</Badge>
              )}
            </p>
          )}
        </Card>

        <Card title="Allocation vs Target (60/25/15)">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {allocation?.slices.map((s) => (
                  <div key={s.name} className="flex justify-between">
                    <span className="text-muted">{s.name}</span>
                    <span className="tabular-nums">
                      {s.percent.toFixed(1)}% / {s.targetPercent.toFixed(0)}%
                      <span className={s.drift >= 0 ? ' text-primary ml-2' : ' text-danger ml-2'}>
                        ({s.drift >= 0 ? '+' : ''}{s.drift.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted text-sm">No allocation data yet.</p>
          )}
        </Card>
      </div>

      {holdingsLoading && <p className="text-muted">Loading holdings...</p>}

      {!holdingsLoading && holdings && holdings.length > 0 && (
        <DataTable
          data={holdings}
          keyExtractor={(h) => h.id}
          columns={[
            {
              key: 'name',
              header: 'Security',
              render: (h: Holding) => h.securityName ?? h.ticker ?? 'Unknown',
            },
            { key: 'ticker', header: 'Ticker', render: (h) => h.ticker ?? '—' },
            { key: 'quantity', header: 'Qty', className: 'tabular-nums' },
            {
              key: 'institutionValue',
              header: 'Value',
              render: (h) => formatCurrency(h.institutionValue ?? 0),
            },
            {
              key: 'costBasis',
              header: 'Cost Basis',
              render: (h) => formatCurrency(h.costBasis ?? 0),
            },
          ]}
        />
      )}

      {holdings?.length === 0 && !holdingsLoading && (
        <Card><p className="text-muted text-sm">No investment holdings synced. Link an investment account via Plaid.</p></Card>
      )}
    </div>
  );
}
