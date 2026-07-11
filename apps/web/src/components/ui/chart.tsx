'use client';

import clsx from 'clsx';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const;

export const chartAxisStyle = { fill: 'var(--chart-axis)', fontSize: 12 };
export const chartGridStroke = 'var(--chart-grid)';
export const chartTooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--card-border)',
  borderRadius: 8,
  color: 'var(--foreground)',
};

export interface ChartContainerProps {
  children: ReactNode;
  className?: string;
  height?: number;
}

/** Shared responsive chart frame with tokenized empty height. */
export function ChartContainer({ children, className, height = 240 }: ChartContainerProps) {
  return (
    <div className={clsx('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartGrid() {
  return <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" />;
}

export function ChartXAxis(props: ComponentProps<typeof XAxis>) {
  return <XAxis tick={chartAxisStyle} stroke="var(--chart-axis)" {...props} />;
}

export function ChartYAxis(props: ComponentProps<typeof YAxis>) {
  return <YAxis tick={chartAxisStyle} stroke="var(--chart-axis)" {...props} />;
}

export function ChartTooltip(props: Omit<ComponentProps<typeof Tooltip>, 'ref'>) {
  return <Tooltip contentStyle={chartTooltipStyle} {...props} />;
}

export function ChartLegend(props: Omit<ComponentProps<typeof Legend>, 'ref'>) {
  return <Legend wrapperStyle={{ color: 'var(--chart-axis)', fontSize: 12 }} {...props} />;
}
