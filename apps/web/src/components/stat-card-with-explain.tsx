'use client';

import { StatCard, type StatCardProps } from '@/components/ui';
import { ExplainButton } from '@/components/explain-button';

const METRIC_MAP: Record<string, string> = {
  'Net Worth': 'net_worth',
  'Savings Rate': 'savings_rate',
  'Health Score': 'health_score',
  'Total Assets': 'net_worth',
};

interface StatCardWithExplainProps extends StatCardProps {
  explainMetric?: string;
}

export function StatCardWithExplain({ title, explainMetric, ...props }: StatCardWithExplainProps) {
  const metric = explainMetric ?? METRIC_MAP[title] ?? title.toLowerCase().replace(/\s+/g, '_');
  return (
    <div className="relative">
      <StatCard title={title} {...props} />
      <div className="absolute top-2 right-2">
        <ExplainButton metric={metric} label="" className="h-7 w-7 p-0 min-w-0" />
      </div>
    </div>
  );
}
