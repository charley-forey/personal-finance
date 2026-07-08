'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, Skeleton, StatCard } from '@/components/ui';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NetWorthPage() {
  const formatCurrency = useFormatCurrency();
  const [data, setData] = useState<{ current: { netWorth: number; totalAssets?: number; totalLiabilities?: number }; history: Array<{ snapshotDate: string; netWorth: string }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .netWorth()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load net worth'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data?.history.map((h) => ({ date: h.snapshotDate, value: parseFloat(h.netWorth) })) ?? [];

  return (
    <div>
      <PageHeader title="Net Worth" description="Assets minus liabilities over time" />

      {error && <PageError message={error} />}
      {loading && <PageLoading variant="chart" className="mb-6" />}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          <StatCard title="Net Worth" value={formatCurrency(data.current.netWorth)} />
          {data.current.totalAssets != null && (
            <StatCard title="Total Assets" value={formatCurrency(data.current.totalAssets)} />
          )}
          {data.current.totalLiabilities != null && (
            <StatCard title="Total Liabilities" value={formatCurrency(data.current.totalLiabilities)} />
          )}
        </div>
      )}

      <Card title="History">
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No history yet"
            description="Net worth snapshots will appear after you link accounts and sync data."
          />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
