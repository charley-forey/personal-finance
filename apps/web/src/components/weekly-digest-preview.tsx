'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useCashFlow, useHealthScore, useInbox, useNetWorth } from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';

/** Lightweight preview of the Monday weekly digest for Command home. */
export function WeeklyDigestPreview() {
  const formatCurrency = useFormatCurrency();
  const { data: netWorth } = useNetWorth();
  const { data: cashFlow } = useCashFlow();
  const { data: health } = useHealthScore();
  const { data: inbox } = useInbox();

  const nw = netWorth?.current?.netWorth;
  const inboxCount =
    (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);

  return (
    <Card title="Weekly digest preview" className="mb-6 md:mb-8">
      <div className="flex gap-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1 space-y-2 text-sm">
          <p className="text-muted">
            A Monday snapshot of net worth, cash flow, and open inbox items.
          </p>
          <ul className="space-y-1 text-foreground">
            <li>
              Net worth:{' '}
              <span className="tabular-nums font-medium">
                {nw != null ? formatCurrency(nw) : '—'}
              </span>
            </li>
            <li>
              Savings rate:{' '}
              <span className="tabular-nums font-medium">
                {cashFlow ? `${(cashFlow.savingsRate * 100).toFixed(1)}%` : '—'}
              </span>
            </li>
            <li>
              Health score:{' '}
              <span className="tabular-nums font-medium">
                {health ? `${health.overall}/100` : '—'}
              </span>
            </li>
            <li>
              Inbox items:{' '}
              <span className="tabular-nums font-medium">{inboxCount}</span>
            </li>
          </ul>
          <Link href="/app/settings">
            <Button size="sm" variant="secondary" className="mt-2">
              Digest preferences
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
