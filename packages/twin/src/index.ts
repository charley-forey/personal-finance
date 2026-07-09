export interface TwinBranch {
  id: string;
  label: 'expected' | 'optimistic' | 'stress';
  netWorthSeries: Array<{ month: number; value: number }>;
  assumptions: Record<string, unknown>;
}

export interface TwinState {
  orgId: string;
  branches: TwinBranch[];
  updatedAt: string;
}

export function runTwinSimulation(input: {
  orgId: string;
  currentNetWorth: number;
  monthlySavings: number;
  monthlyExpenses: number;
}): TwinState {
  const branches: TwinBranch[] = [
    {
      id: 'expected',
      label: 'expected',
      assumptions: { savings: input.monthlySavings, expenseGrowth: 0.02 },
      netWorthSeries: Array.from({ length: 36 }, (_, i) => ({
        month: i + 1,
        value: input.currentNetWorth + input.monthlySavings * (i + 1) * 0.9,
      })),
    },
    {
      id: 'optimistic',
      label: 'optimistic',
      assumptions: { savings: input.monthlySavings * 1.2, marketReturn: 0.08 },
      netWorthSeries: Array.from({ length: 36 }, (_, i) => ({
        month: i + 1,
        value: input.currentNetWorth * Math.pow(1.006, i + 1) + input.monthlySavings * 1.2 * (i + 1),
      })),
    },
    {
      id: 'stress',
      label: 'stress',
      assumptions: { jobLossMonths: 2, expenseSpike: 1.15 },
      netWorthSeries: Array.from({ length: 36 }, (_, i) => ({
        month: i + 1,
        value: input.currentNetWorth + input.monthlySavings * (i + 1) * 0.5 - input.monthlyExpenses * 0.1 * i,
      })),
    },
  ];

  return { orgId: input.orgId, branches, updatedAt: new Date().toISOString() };
}

export function counterfactualDelta(branch: TwinBranch, month: number): number {
  const point = branch.netWorthSeries.find((p) => p.month === month);
  const baseline = branch.netWorthSeries[0]?.value ?? 0;
  return (point?.value ?? baseline) - baseline;
}
