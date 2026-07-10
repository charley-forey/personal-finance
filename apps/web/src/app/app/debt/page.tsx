'use client';

import { useEffect, useState } from 'react';
import { AppPageHeader, Card, ProvenanceChip } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, Input, Select } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { useLiabilities } from '@/hooks/use-finance';
import { api, type Liability } from '@/lib/api';

interface Debt {
  name: string;
  balance: string;
  interestRate: string;
  minimumPayment: string;
}

function liabilityToDebt(l: Liability): Debt {
  const balance = l.balance != null ? Math.abs(parseFloat(String(l.balance))) : 0;
  const apr = l.apr != null ? parseFloat(l.apr) : 0;
  return {
    name: l.accountName ?? l.liabilityType ?? 'Debt',
    balance: Number.isFinite(balance) ? String(Math.round(balance * 100) / 100) : '',
    interestRate: Number.isFinite(apr) ? String(Math.round(apr * 100) / 100) : '',
    minimumPayment: l.minimumPayment ?? '',
  };
}

export default function DebtPage() {
  const { data: liabilities, isLoading, error } = useLiabilities();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [extraPayment, setExtraPayment] = useState('200');
  const [defaultRate, setDefaultRate] = useState('18');
  const [horizonMonths, setHorizonMonths] = useState('36');
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [result, setResult] = useState<{ months: number; totalInterest: number } | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (seeded || isLoading || !liabilities) return;
    if (liabilities.length > 0) {
      setDebts(liabilities.map(liabilityToDebt));
    } else {
      setDebts([{ name: '', balance: '', interestRate: '18', minimumPayment: '' }]);
    }
    setSeeded(true);
  }, [liabilities, isLoading, seeded]);

  async function simulate() {
    setSimulating(true);
    try {
      const r = await api.debtSimulate({
        debts: debts.map((d) => ({
          name: d.name,
          balance: parseFloat(d.balance),
          interestRate: parseFloat(d.interestRate || defaultRate) / 100,
          minimumPayment: parseFloat(d.minimumPayment),
        })),
        extraPayment: parseFloat(extraPayment),
        strategy,
        targetMonths: parseInt(horizonMonths, 10) || undefined,
      });
      setResult(r as typeof result);
    } finally {
      setSimulating(false);
    }
  }

  const applyDefaultRate = () => {
    setDebts((prev) =>
      prev.map((d) => ({
        ...d,
        interestRate: d.interestRate.trim() ? d.interestRate : defaultRate,
      })),
    );
  };

  return (
    <div>
      <AppPageHeader title="Debt Payoff" description="Avalanche vs snowball optimizer" />

      {error && <PageError message={error.message} className="mb-4" />}
      {isLoading && <PageLoading variant="list" count={3} className="mb-6" />}

      {!isLoading && (
        <Card className="mb-6" title="Assumptions">
          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            <Input
              label="Default APR %"
              type="number"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              onBlur={applyDefaultRate}
            />
            <Input
              label="Target horizon (months)"
              type="number"
              value={horizonMonths}
              onChange={(e) => setHorizonMonths(e.target.value)}
            />
            <Input
              label="Extra monthly payment"
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted mb-4">
            Defaults apply when a debt row has no APR. Horizon is a planning target shown against simulation results.
          </p>

          {(liabilities?.length ?? 0) > 0 && (
            <p className="mb-4 text-sm text-muted">
              Pre-filled from {liabilities!.length} linked {liabilities!.length === 1 ? 'liability' : 'liabilities'}. Adjust values before simulating.
            </p>
          )}
          <div className="space-y-4">
            {debts.map((debt, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-4">
                <Input
                  label={i === 0 ? 'Name' : undefined}
                  placeholder="Name"
                  value={debt.name}
                  onChange={(e) => {
                    const d = [...debts];
                    d[i] = { ...d[i]!, name: e.target.value };
                    setDebts(d);
                  }}
                />
                <Input
                  label={i === 0 ? 'Balance' : undefined}
                  type="number"
                  placeholder="Balance"
                  value={debt.balance}
                  onChange={(e) => {
                    const d = [...debts];
                    d[i] = { ...d[i]!, balance: e.target.value };
                    setDebts(d);
                  }}
                />
                <Input
                  label={i === 0 ? 'APR %' : undefined}
                  type="number"
                  placeholder={`APR % (default ${defaultRate})`}
                  value={debt.interestRate}
                  onChange={(e) => {
                    const d = [...debts];
                    d[i] = { ...d[i]!, interestRate: e.target.value };
                    setDebts(d);
                  }}
                />
                <Input
                  label={i === 0 ? 'Min payment' : undefined}
                  type="number"
                  placeholder="Min payment"
                  value={debt.minimumPayment}
                  onChange={(e) => {
                    const d = [...debts];
                    d[i] = { ...d[i]!, minimumPayment: e.target.value };
                    setDebts(d);
                  }}
                />
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setDebts([...debts, { name: '', balance: '', interestRate: defaultRate, minimumPayment: '' }])
              }
            >
              + Add debt
            </Button>
            <Select
              label="Strategy"
              options={[
                { value: 'avalanche', label: 'Avalanche (highest APR first)' },
                { value: 'snowball', label: 'Snowball (smallest balance first)' },
              ]}
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
            />
            <Button onClick={simulate} disabled={simulating || debts.every((d) => !d.balance)}>
              {simulating ? 'Simulating…' : 'Run Simulation'}
            </Button>
          </div>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-2 gap-4">
          <StatCardWithExplain
            title="Months to Payoff"
            value={String(result.months)}
            change={{
              value:
                parseInt(horizonMonths, 10) > 0
                  ? result.months <= parseInt(horizonMonths, 10)
                    ? `Within ${horizonMonths}mo target`
                    : `${result.months - parseInt(horizonMonths, 10)}mo over target`
                  : 'Simulation',
              trend:
                parseInt(horizonMonths, 10) > 0 && result.months <= parseInt(horizonMonths, 10)
                  ? 'up'
                  : 'neutral',
            }}
            provenance={
              <ProvenanceChip
                source="Debt simulator"
                detail={`${strategy} · ${defaultRate}% default APR`}
                methodologyHref="/app/library"
              />
            }
          />
          <StatCardWithExplain
            title="Total Interest"
            value={`$${result.totalInterest.toFixed(0)}`}
            explainMetric="debt_ratio"
            provenance={
              <ProvenanceChip source="Debt simulator" detail="Projected interest" methodologyHref="/app/library" />
            }
          />
        </div>
      )}
    </div>
  );
}
