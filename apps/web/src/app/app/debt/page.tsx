'use client';

import { useState } from 'react';
import { PageHeader, Card, StatCard } from '@/components/app-shell';
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
              <input placeholder="Name" className="bg-background border border-card-border rounded-lg px-3 py-2" value={debt.name} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, name: e.target.value }; setDebts(d); }} />
              <input type="number" placeholder="Balance" className="bg-background border border-card-border rounded-lg px-3 py-2" value={debt.balance} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, balance: e.target.value }; setDebts(d); }} />
              <input type="number" placeholder="APR %" className="bg-background border border-card-border rounded-lg px-3 py-2" value={debt.interestRate} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, interestRate: e.target.value }; setDebts(d); }} />
              <input type="number" placeholder="Min payment" className="bg-background border border-card-border rounded-lg px-3 py-2" value={debt.minimumPayment} onChange={(e) => { const d = [...debts]; d[i] = { ...d[i]!, minimumPayment: e.target.value }; setDebts(d); }} />
            </div>
          ))}
          <button onClick={() => setDebts([...debts, { name: '', balance: '', interestRate: '', minimumPayment: '' }])} className="text-sm text-primary">+ Add debt</button>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="number" placeholder="Extra monthly payment" className="bg-background border border-card-border rounded-lg px-3 py-2" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
            <select className="bg-background border border-card-border rounded-lg px-3 py-2" value={strategy} onChange={(e) => setStrategy(e.target.value as 'avalanche' | 'snowball')}>
              <option value="avalanche">Avalanche (highest APR first)</option>
              <option value="snowball">Snowball (smallest balance first)</option>
            </select>
          </div>
          <button onClick={simulate} disabled={loading} className="px-4 py-2 bg-primary text-black rounded-lg font-medium disabled:opacity-50">
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </Card>

      {result && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Months to Payoff" value={String(result.months)} />
          <StatCard label="Total Interest" value={`$${result.totalInterest.toFixed(0)}`} />
        </div>
      )}
    </div>
  );
}
