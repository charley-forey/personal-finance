'use client';

import { useEffect, useState } from 'react';
import { PageHeader, Card, StatCard } from '@/components/app-shell';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NetWorthPage() {
  const formatCurrency = useFormatCurrency();
  const [data, setData] = useState<{ current: { netWorth: number }; history: Array<{ snapshotDate: string; netWorth: string }> } | null>(null);

  useEffect(() => {
    api.netWorth().then(setData).catch(console.error);
  }, []);

  const chartData = data?.history.map((h) => ({ date: h.snapshotDate, value: parseFloat(h.netWorth) })) ?? [];

  return (
    <div>
      <PageHeader title="Net Worth" description="Assets minus liabilities over time" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Net Worth" value={data ? formatCurrency(data.current.netWorth) : '—'} />
      </div>
      <Card title="History">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
