'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';
import { HubLayout } from '@/components/hub-layout';
import { ExplainButton } from '@/components/explain-button';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, Skeleton, StatCard } from '@/components/ui';
import {
  useManualAssets,
  useNetWorth,
  usePortfolioAllocation,
} from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';

const NetWorthChart = dynamic(
  () => import('@/components/net-worth-chart').then((m) => m.NetWorthChart),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full" /> },
);

export default function WealthHubPage() {
  const fmt = useFormatCurrency();
  const { data: nw, isLoading: nwLoading, error: nwError } = useNetWorth();
  const { data: allocation, isLoading: allocLoading } = usePortfolioAllocation();
  const { data: assets, isLoading: assetsLoading } = useManualAssets();

  const current = nw?.current;
  const history = useMemo(
    () =>
      (nw?.history ?? []).map((h) => ({
        date: h.snapshotDate,
        value: parseFloat(h.netWorth),
      })),
    [nw?.history],
  );
  const topSlices = (allocation?.slices ?? []).slice(0, 3);
  const loading = nwLoading || allocLoading || assetsLoading;

  return (
    <HubLayout
      title="Wealth"
      description="Am I building wealth?"
      hubId="wealth"
      hubHref="/app/wealth"
      firstJob={{
        href: '/app/net-worth',
        label: 'Review net worth trend',
        description: 'Confirm assets and liabilities look right before forecasting.',
      }}
    >
      {nwError && <PageError message={nwError.message} />}

      {loading ? (
        <PageLoading variant="stats" count={3} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
              <StatCard title="Net Worth" value={fmt(current?.netWorth ?? 0)} />
              <StatCard title="Total Assets" value={fmt(current?.totalAssets ?? 0)} />
              <StatCard
                title="Investments"
                value={fmt(current?.investments ?? allocation?.total ?? 0)}
                change={
                  allocation
                    ? {
                        value: `Drift ${allocation.driftScore.toFixed(1)}%`,
                        trend: allocation.driftScore > 10 ? 'down' : 'neutral',
                      }
                    : undefined
                }
              />
            </div>
            <ExplainButton metric="net_worth" />
          </div>

          {history.length > 1 && (
            <div className="rounded-lg border border-card-border/60 p-4">
              <p className="text-sm font-medium mb-3">Net worth trend</p>
              <NetWorthChart data={history} />
            </div>
          )}

          {topSlices.length > 0 && (
            <div className="rounded-lg border border-card-border/60 p-4 space-y-2">
              <p className="text-sm font-medium">Allocation</p>
              {topSlices.map((slice) => (
                <div key={slice.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{slice.name}</span>
                  <span className="tabular-nums font-medium">
                    {slice.percent.toFixed(0)}% · {fmt(slice.value)}
                  </span>
                </div>
              ))}
              <Link href="/app/investments" className="text-xs text-primary hover:underline">
                View portfolio →
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/app/assets">
          <Button size="sm">
            Add manual asset{assets && assets.length > 0 ? ` (${assets.length})` : ''}
          </Button>
        </Link>
        <Link href="/app/net-worth">
          <Button size="sm" variant="secondary">
            Net worth detail
          </Button>
        </Link>
        <Link href="/app/investments">
          <Button size="sm" variant="secondary">
            Rebalance
          </Button>
        </Link>
      </div>
    </HubLayout>
  );
}
