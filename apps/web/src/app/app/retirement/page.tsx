'use client';

import { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Landmark } from 'lucide-react';
import { AppPageHeader, Button, Card, Input, ProvenanceChip } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { EmptyState, Skeleton, Badge } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { api, formatCurrency } from '@/lib/api';
import { useAccounts, useNetWorth } from '@/hooks/use-finance';
import { purposeFromAccount } from '@pf/shared';

export default function RetirementPage() {
  const { data: accounts } = useAccounts();
  const { data: nw } = useNetWorth();
  const retirementAccounts = (accounts ?? []).filter((a) => purposeFromAccount(a) === 'retirement');
  const retirementBalance =
    nw?.current?.retirement ??
    retirementAccounts.reduce((s, a) => s + parseFloat(a.currentBalance ?? '0'), 0);

  const [years, setYears] = useState('30');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [monthlyContribution, setMonthlyContribution] = useState('2000');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState('5000');
  const [startingBalance, setStartingBalance] = useState('');
  const [result, setResult] = useState<{
    result?: {
      successRate: number;
      medianEndingBalance: number;
      percentiles: { p50: number[]; p10: number[]; p90: number[] };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded) return;
    if (retirementBalance > 0) {
      setStartingBalance(String(Math.round(retirementBalance)));
      setSeeded(true);
    }
  }, [retirementBalance, seeded]);

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
        startingBalance: parseFloat(startingBalance) || retirementBalance || 0,
      });
      setResult(r as typeof result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [years, expectedReturn, monthlyContribution, monthlyWithdrawal, startingBalance, retirementBalance]);

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
      detail={`${years}y · ${expectedReturn}% return · seeded from linked retirement`}
      methodologyHref="/app/library"
    />
  );

  return (
    <div>
      <AppPageHeader
        title="Retirement"
        description="Linked retirement accounts and Monte Carlo projections"
        actions={retirementAccounts.length === 0 ? <PlaidLinkButton /> : undefined}
      />

      <section className="mb-8">
        <h2 className="mb-4 text-sm font-medium text-muted uppercase tracking-wide">Linked retirement accounts</h2>
        {retirementAccounts.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No retirement accounts linked"
            description="Link a 401(k), IRA, or similar account via Plaid. Re-link older connections with the investments product if holdings are missing."
            action={<PlaidLinkButton />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            {retirementAccounts.map((acct) => (
              <Card key={acct.id}>
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{acct.displayName ?? acct.name}</h3>
                    <p className="text-sm text-muted capitalize">{acct.subtype ?? acct.type}</p>
                  </div>
                  <Badge variant="success">Retirement</Badge>
                </div>
                {acct.currentBalance != null && (
                  <p className="mt-2 text-lg tabular-nums font-medium">{formatCurrency(acct.currentBalance)}</p>
                )}
              </Card>
            ))}
          </div>
        )}
        {retirementBalance > 0 && (
          <StatCardWithExplain
            title="Retirement balances"
            value={formatCurrency(retirementBalance)}
            provenance={
              <ProvenanceChip source="Linked accounts" detail="Purpose = retirement" href="/app/accounts" />
            }
          />
        )}
      </section>

      <Card title="Assumptions" className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Starting balance"
            type="number"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
          />
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
