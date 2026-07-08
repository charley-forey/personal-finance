'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, StatCard, Card } from '@/components/app-shell';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { api, formatCurrency, setAuthToken, type NetWorth, type CashFlow, type Insight } from '@/lib/api';

export default function DashboardPage() {
  const [netWorth, setNetWorth] = useState<NetWorth | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlow | null>(null);
  const [history, setHistory] = useState<Array<{ date: string; value: number }>>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [health, setHealth] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('pf_token');
    if (!token) {
      api.createSession({ workosUserId: 'demo-user', email: 'demo@example.com', name: 'Demo' })
        .then((r) => setAuthToken(r.token))
        .then(load)
        .catch((e) => setError(e.message));
    } else {
      setAuthToken(token);
      load();
    }
  }, []);

  async function load() {
    try {
      const [nw, cf, ins, hs] = await Promise.all([
        api.netWorth(),
        api.cashFlow(),
        api.insights(),
        api.healthScore().catch(() => null),
      ]);
      setNetWorth(nw.current);
      setHistory(nw.history.map((h) => ({ date: h.snapshotDate, value: parseFloat(h.netWorth) })));
      setCashFlow(cf);
      setInsights(ins.slice(0, 3));
      if (hs) setHealth(hs.overall);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    }
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Your complete financial overview" />

      {error && (
        <Card className="mb-6 border-danger/50">
          <p className="text-danger text-sm">{error}</p>
          <p className="text-muted text-xs mt-2">Start the API with: npm run dev:api</p>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Net Worth" value={netWorth ? formatCurrency(netWorth.netWorth) : '—'} />
        <StatCard label="Total Assets" value={netWorth ? formatCurrency(netWorth.totalAssets) : '—'} />
        <StatCard label="Savings Rate" value={cashFlow ? `${(cashFlow.savingsRate * 100).toFixed(1)}%` : '—'} />
        <StatCard label="Health Score" value={health !== null ? `${health}/100` : '—'} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card title="Net Worth Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Connect Accounts">
          <PlaidLinkButton />
          <p className="text-xs text-muted mt-4">Uses Plaid Link in sandbox mode</p>
        </Card>
      </div>

      <Card title="Recent Insights">
        {insights.length === 0 ? (
          <p className="text-muted text-sm">No insights yet. Link an account to get started.</p>
        ) : (
          <div className="space-y-4">
            {insights.map((i) => (
              <div key={i.id} className="border-l-2 border-primary pl-4">
                <p className="font-medium">{i.title}</p>
                <p className="text-sm text-muted mt-1">{i.body}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
