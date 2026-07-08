'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFormatCurrency } from '@/hooks/use-currency';

interface NetWorthChartProps {
  data: Array<{ date: string; value: number }>;
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  const formatCurrency = useFormatCurrency();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickMargin={8} />
        <YAxis
          stroke="#71717a"
          fontSize={11}
          width={48}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
