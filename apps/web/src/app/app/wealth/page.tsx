'use client';

import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';
import { useNetWorth } from '@/hooks/use-finance';
import { StatCard } from '@/components/ui';
import { ExplainButton } from '@/components/explain-button';
import { useFormatCurrency } from '@/hooks/use-currency';

const LINKS = [
  { href: '/app/net-worth', label: 'Net Worth', description: 'Assets vs liabilities' },
  { href: '/app/investments', label: 'Investments', description: 'Holdings and allocation' },
  { href: '/app/assets', label: 'Assets', description: 'Manual asset tracking' },
  { href: '/app/equity', label: 'Equity', description: 'RSU and stock grants' },
  { href: '/app/forecasts', label: 'Forecasts', description: 'Cash flow projections' },
];

export default function WealthHubPage() {
  const { data: nw } = useNetWorth();
  const fmt = useFormatCurrency();
  const current = nw?.current.netWorth ?? 0;

  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout title="Wealth" description="Am I building wealth?" hubId="wealth" links={LINKS}>
        <div className="flex items-start gap-2">
          <StatCard title="Net Worth" value={fmt(current)} />
          <ExplainButton metric="net_worth" />
        </div>
      </HubLayout>
    </div>
  );
}
