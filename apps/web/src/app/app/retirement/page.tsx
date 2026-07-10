'use client';

import { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Landmark } from 'lucide-react';
import { AppPageHeader, Button, Card, Input, ProvenanceChip } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { PageContextBanner } from '@/components/page-context-banner';
import { EmptyState, Skeleton } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { api } from '@/lib/api';

export default function RetirementPage() {
  const [years, setYears] = useState('30');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [monthlyContribution, setMonthlyContribution] = useState('2000');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState('5000');
  const [result, setResult] = useState<{
    result?: {
      successRate: number;
      medianEndingBalance: number;
      percentiles: { p50: number[]; p10: number[]; p90: number[] };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.monteCarlo({
        name: 'Retirement',
        years: parseInt(years, 10) || 30,
        expectedReturn: (parseFloat(expectedReturn) || 7) / 100,
        monthlyContribution: parseFloat(monthlyContribution) || 0,
        monthlyWithdrawal: parseFloat(monthlyWithdrawal) || 0,
      });
      setResult(r as typeof result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [years, expectedReturn, monthlyContribution, monthlyWithdrawal]);

  useEffect(() => {
    void runSimulation();
    // Initial run with defaults only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData =
    result?.result?.percentiles.p50.map((_, i) => ({
      year: i + 1,
      p50: result.result!.percentiles.p50[i],
      p10: result.result!.percentiles.p10[i],
      p90: result.result!.percentiles.p90[i],
    })) ?? [];

  const provenance = (
    <ProvenanceChip
      source="Monte Carlo"
      detail={`${years}y · ${expectedReturn}% return`}
      methodologyHref="/app/library"
    />
  );

  return (
    <div>
      <AppPageHeader title="Retirement" description="Monte Carlo simulation with percentile bands" />

      <div className="mb-4">
        <PageContextBanner />
      </div>

      <Card title="Assumptions" className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Horizon (years)"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <Input
            label="Expected return %"
            type="number"
            step="0.1"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
          />
          <Input
            label="Monthly contribution"
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
          />
          <Input
            label="Monthly withdrawal"
            type="number"
            value={monthlyWithdrawal}
            onChange={(e) => setMonthlyWithdrawal(e.target.value)}
          />
        </div>
        <Button className="mt-4" size="sm" onClick={() => void runSimulation()} disabled={loading}>
          {loading ? 'Running…' : 'Re-run simulation'}
        </Button>
      </Card>

      {error && <PageError message={error} />}
      {loading && !result && <PageLoading variant="chart" className="mb-6" />}

      {!error && result?.result && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCardWithExplain
            title="Success Rate"
            value={`${result.result.successRate.toFixed(1)}%`}
            provenance={provenance}
          />
          <StatCardWithExplain
            title="Median Ending Balance"
            value={`$${(result.result.medianEndingBalance / 1000).toFixed(0)}k`}
            explainMetric="net_worth"
            provenance={provenance}
          />
        </div>
      )}

      <Card title="Portfolio Projection (Fan Chart)">
        {loading && !result ? (
          <Skeleton className="h-[350px] w-full" />
        ) : chartData.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No simulation data"
            description="Adjust assumptions and run a Monte Carlo simulation to see retirement projections."
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
