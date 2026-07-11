'use client';

import { LineChart, Line } from 'recharts';
import {
  AppPageHeader,
  Card,
  ChartContainer,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  CHART_COLORS,
  EmptyState,
  Skeleton,
  StatCard,
} from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api } from '@/lib/api';
import { TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function ForecastsPage() {
  const formatCurrency = useFormatCurrency();
  const [series, setSeries] = useState<Array<{ month: number; balance: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .cashFlowForecast()
      .then((r) => setSeries(r.series as typeof series))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load forecast'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (series.length === 0) return null;
    const start = series[0]!.balance;
    const end = series[series.length - 1]!.balance;
    const min = Math.min(...series.map((s) => s.balance));
    const max = Math.max(...series.map((s) => s.balance));
    return { start, end, min, max, change: end - start };
  }, [series]);

  return (
    <div>
      <AppPageHeader title="Forecasts" description="Cash flow projections" />

      {error && <PageError message={error} />}

      {loading && <PageLoading variant="chart" className="mb-6" />}

      {!loading && !error && stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard title="Starting Balance" value={formatCurrency(stats.start)} />
          <StatCard
            title="Projected End"
            value={formatCurrency(stats.end)}
            change={{
              value: `${stats.change >= 0 ? '+' : ''}${formatCurrency(stats.change)} over 36 mo`,
              trend: stats.change >= 0 ? 'up' : 'down',
            }}
          />
          <StatCard title="Low Point" value={formatCurrency(stats.min)} />
          <StatCard title="Peak Balance" value={formatCurrency(stats.max)} />
        </div>
      )}

      <Card title="36-Month Cash Flow">
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : series.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No forecast data"
            description="Link accounts and sync transactions to generate cash flow projections."
          />
        ) : (
          <ChartContainer height={300}>
            <LineChart data={series}>
              <ChartXAxis dataKey="month" />
              <ChartYAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip formatter={(v) => formatCurrency(Number(v))} />
              <Line type="monotone" dataKey="balance" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </Card>
    </div>
  );
}
