'use client';

import { Line, LineChart } from 'recharts';
import { useFormatCurrency } from '@/hooks/use-currency';
import {
  ChartContainer,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  CHART_COLORS,
} from '@/components/ui';

interface NetWorthChartProps {
  data: Array<{ date: string; value: number }>;
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  const formatCurrency = useFormatCurrency();
  return (
    <ChartContainer height={220}>
      <LineChart data={data}>
        <ChartXAxis dataKey="date" tickMargin={8} />
        <ChartYAxis width={48} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
        <ChartTooltip formatter={(v) => formatCurrency(Number(v))} />
        <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
