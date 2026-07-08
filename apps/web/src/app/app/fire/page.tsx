'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card } from '@/components/app-shell';
import { Skeleton, StatCard } from '@/components/ui';
import { api } from '@/lib/api';
import { calculateFIRE, generateFireProjection } from '@/lib/fire';
import { formatCurrency } from '@/lib/format';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm tabular-nums text-primary">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function FirePage() {
  const [annualExpenses, setAnnualExpenses] = useState(60000);
  const [annualSavings, setAnnualSavings] = useState(12000);
  const [netWorth, setNetWorth] = useState(100000);
  const [initialized, setInitialized] = useState(false);

  const { data: fireDefaults, isLoading } = useQuery({
    queryKey: ['fire-defaults'],
    queryFn: async () => {
      const [fire, nw, cf] = await Promise.all([api.fire(), api.netWorth(), api.cashFlow()]);
      return { fire, nw, cf };
    },
  });

  useEffect(() => {
    if (fireDefaults && !initialized) {
      const monthlyExpenses = fireDefaults.cf.expenses;
      const monthlySavings = fireDefaults.cf.savings;
      setAnnualExpenses(Math.round(monthlyExpenses * 12) || 60000);
      setAnnualSavings(Math.round(monthlySavings * 12) || 12000);
      setNetWorth(Math.round(fireDefaults.nw.current.netWorth) || 100000);
      setInitialized(true);
    }
  }, [fireDefaults, initialized]);

  const result = useMemo(
    () => calculateFIRE(annualExpenses, netWorth, annualSavings),
    [annualExpenses, netWorth, annualSavings],
  );

  const chartData = useMemo(
    () => generateFireProjection(annualExpenses, netWorth, annualSavings),
    [annualExpenses, netWorth, annualSavings],
  );

  return (
    <div>
      <PageHeader
        title="FIRE Calculator"
        description="Financial Independence / Retire Early — adjust assumptions to see your path"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Assumptions" className="lg:col-span-1">
          {isLoading && !initialized ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <SliderField
                label="Annual Expenses"
                value={annualExpenses}
                min={20000}
                max={200000}
                step={1000}
                format={(v) => formatCurrency(v)}
                onChange={setAnnualExpenses}
              />
              <SliderField
                label="Annual Savings"
                value={annualSavings}
                min={0}
                max={100000}
                step={1000}
                format={(v) => formatCurrency(v)}
                onChange={setAnnualSavings}
              />
              <SliderField
                label="Current Net Worth"
                value={netWorth}
                min={0}
                max={2000000}
                step={5000}
                format={(v) => formatCurrency(v)}
                onChange={setNetWorth}
              />
            </div>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard title="FIRE Number" value={formatCurrency(result.fireNumber)} />
            <StatCard title="Years to FI" value={result.yearsToFI.toFixed(1)} />
            <StatCard title="Progress" value={`${result.progress.toFixed(1)}%`} />
            <StatCard title="Coast FI" value={formatCurrency(result.coastFI)} />
          </div>

          <Card title="Path to Financial Independence">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="year"
                  stroke="#71717a"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#71717a' }}
                />
                <YAxis stroke="#71717a" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#3b82f6"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  dot={false}
                  name="FIRE Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
