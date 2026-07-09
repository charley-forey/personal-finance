'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Landmark } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, Skeleton } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { api } from '@/lib/api';

export default function RetirementPage() {
  const [result, setResult] = useState<{ result?: { successRate: number; medianEndingBalance: number; percentiles: { p50: number[]; p10: number[]; p90: number[] } } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .monteCarlo({ name: 'Retirement', years: 30, monthlyContribution: 2000, monthlyWithdrawal: 5000 })
      .then((r) => setResult(r as typeof result))
      .catch((err) => setError(err instanceof Error ? err.message : 'Simulation failed'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = result?.result?.percentiles.p50.map((_, i) => ({
    year: i + 1,
    p50: result.result!.percentiles.p50[i],
    p10: result.result!.percentiles.p10[i],
    p90: result.result!.percentiles.p90[i],
  })) ?? [];

  return (
    <div>
      <PageHeader title="Retirement" description="Monte Carlo simulation with percentile bands" />

      {error && <PageError message={error} />}
      {loading && <PageLoading variant="chart" className="mb-6" />}

      {!loading && !error && result?.result && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCardWithExplain title="Success Rate" value={`${result.result.successRate.toFixed(1)}%`} />
          <StatCardWithExplain title="Median Ending Balance" value={`$${(result.result.medianEndingBalance / 1000).toFixed(0)}k`} explainMetric="net_worth" />
        </div>
      )}

      <Card title="Portfolio Projection (Fan Chart)">
        {loading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : chartData.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No simulation data"
            description="Run a Monte Carlo simulation to see retirement projections."
          />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <XAxis dataKey="year" stroke="#71717a" />
              <YAxis stroke="#71717a" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="p10" stroke="#ef4444" strokeDasharray="3 3" dot={false} name="P10" />
              <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={2} dot={false} name="P50" />
              <Line type="monotone" dataKey="p90" stroke="#3b82f6" strokeDasharray="3 3" dot={false} name="P90" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
