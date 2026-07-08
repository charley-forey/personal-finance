'use client';
import { useState } from 'react';
import { PageHeader, Card, StatCard } from '@/components/app-shell';
import { api, setAuthToken } from '@/lib/api';

export default function DebtPage() {
  const [result, setResult] = useState<{ months: number; totalInterest: number } | null>(null);
  async function simulate() {
    const t = localStorage.getItem('pf_token'); if (t) setAuthToken(t);
    const r = await api.debtSimulate({
      debts: [{ name: 'Credit Card', balance: 5000, interestRate: 0.22, minimumPayment: 150 }],
      extraPayment: 200,
      strategy: 'avalanche',
    });
    setResult(r as typeof result);
  }
  return (
    <div>
      <PageHeader title="Debt Payoff" description="Avalanche vs snowball optimizer" />
      <button onClick={simulate} className="px-4 py-2 bg-primary text-black rounded-lg mb-6">Run Simulation</button>
      {result && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Months to Payoff" value={String(result.months)} />
          <StatCard label="Total Interest" value={`$${result.totalInterest.toFixed(0)}`} />
        </div>
      )}
    </div>
  );
}
