'use client';
import { useEffect, useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForecastsPage() {
  const [series, setSeries] = useState<Array<{ month: number; balance: number }>>([]);
  useEffect(() => {
    api.cashFlowForecast().then((r) => setSeries(r.series as typeof series)).catch(console.error);
  }, []);
  return (
    <div>
      <PageHeader title="Forecasts" description="Cash flow projections" />
      <Card title="36-Month Cash Flow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={series}>
            <XAxis dataKey="month" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
