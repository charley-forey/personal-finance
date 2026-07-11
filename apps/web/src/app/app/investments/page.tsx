'use client';

import { useQuery } from '@tanstack/react-query';
import { PieChart as PieChartIcon } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Badge, DataTable, EmptyState, Skeleton, StatCard } from '@/components/ui';
import { useHoldings, useAccounts } from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api, type Holding } from '@/lib/api';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { purposeFromAccount } from '@pf/shared';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SLICE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export default function InvestmentsPage() {
  const formatCurrency = useFormatCurrency();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: accounts } = useAccounts();
  const brokerageAccounts = (accounts ?? []).filter((a) => purposeFromAccount(a) === 'brokerage');
  const { data: allocation, isLoading: allocLoading } = useQuery({
    queryKey: ['portfolio-allocation'],
    queryFn: () => api.portfolioAllocation(),
  });

  const total = allocation?.total ?? (holdings ?? []).reduce((s, h) => s + parseFloat(String(h.institutionValue ?? '0')), 0);
  const isLoading = holdingsLoading || allocLoading;
  const emptyAction = <PlaidLinkButton />;

  const pieData = (allocation?.slices ?? []).map((s) => ({
    name: s.name,
    value: s.value,
    percent: s.percent,
  }));

  return (
    <div>
      <AppPageHeader
        title="Investments"
        description="Brokerage holdings and allocation vs 60/25/15 target"
        actions={brokerageAccounts.length === 0 && (holdings?.length ?? 0) === 0 ? emptyAction : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {isLoading ? (
          <PageLoading variant="stats" count={1} className="lg:col-span-2" />
        ) : (
          <>
            <StatCard
              title="Total Portfolio Value"
              value={formatCurrency(total)}
              change={
                allocation
                  ? {
                      value: `Drift: ${allocation.driftScore.toFixed(1)}%`,
                      trend: allocation.driftScore > 10 ? 'down' : 'neutral',
                    }
                  : undefined
              }
            />
            {allocation && allocation.driftScore > 10 && (
              <Card className="flex items-center">
                <Badge variant="warning">Rebalance suggested</Badge>
              </Card>
            )}
          </>
        )}

        <Card title="Allocation vs Target (60/25/15)" className={isLoading ? 'lg:col-span-2' : undefined}>
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
            <EmptyState
              icon={PieChartIcon}
              title="No allocation data"
              description="Link an investment account to see portfolio allocation."
              action={emptyAction}
            />
          )}
        </Card>
      </div>

      {holdingsLoading && <PageLoading variant="table" count={4} className="mb-6" />}

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
        <EmptyState
          icon={PieChartIcon}
          title="No holdings synced"
          description="Link an investment account via Plaid, or re-link with the investments product if accounts exist without holdings."
          action={emptyAction}
        />
      )}
    </div>
  );
}
