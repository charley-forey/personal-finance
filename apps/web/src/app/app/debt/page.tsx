'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { Button, Input, Select, StatCard } from '@/components/ui';
import { api } from '@/lib/api';

interface Debt {
  name: string;
  balance: string;
  interestRate: string;
  minimumPayment: string;
}

export default function DebtPage() {
  const [debts, setDebts] = useState<Debt[]>([{ name: 'Credit Card', balance: '5000', interestRate: '22', minimumPayment: '150' }]);
  const [extraPayment, setExtraPayment] = useState('200');
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [result, setResult] = useState<{ months: number; totalInterest: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function simulate() {
    setLoading(true);
    try {
      const r = await api.debtSimulate({
        debts: debts.map((d) => ({
          name: d.name,
          balance: parseFloat(d.balance),
          interestRate: parseFloat(d.interestRate) / 100,
          minimumPayment: parseFloat(d.minimumPayment),
        })),
        extraPayment: parseFloat(extraPayment),
        strategy,
      });
      setResult(r as typeof result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Debt Payoff" description="Avalanche vs snowball optimizer" />

      <Card className="mb-6">
        <div className="space-y-4">
          {debts.map((debt, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-4">
              <Input placeholder="Name" value={debt.name} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, name: e.target.value }; setDebts(d); }} />
              <Input type="number" placeholder="Balance" value={debt.balance} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, balance: e.target.value }; setDebts(d); }} />
              <Input type="number" placeholder="APR %" value={debt.interestRate} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, interestRate: e.target.value }; setDebts(d); }} />
              <Input type="number" placeholder="Min payment" value={debt.minimumPayment} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, minimumPayment: e.target.value }; setDebts(d); }} />
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setDebts([...debts, { name: '', balance: '', interestRate: '', minimumPayment: '' }])}>
            + Add debt
          </Button>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input type="number" placeholder="Extra monthly payment" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
            <Select
              options={[
                { value: 'avalanche', label: 'Avalanche (highest APR first)' },
                { value: 'snowball', label: 'Snowball (smallest balance first)' },
              ]}
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}
            />
          </div>
          <Button onClick={simulate} disabled={loading}>
            {loading ? 'Simulating…' : 'Run Simulation'}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Months to Payoff" value={String(result.months)} />
          <StatCard title="Total Interest" value={`$${result.totalInterest.toFixed(0)}`} />
        </div>
      )}
    </div>
  );
}
