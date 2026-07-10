'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useBillingPlan } from '@/hooks/use-finance';
import { Button } from '@/components/ui';

interface PlanLimitGateProps {
  children: ReactNode;
  /** Which usage counter to gate on. Defaults to banks (Plaid links). */
  limitKey?: 'banks' | 'documents';
  fallback?: ReactNode;
}

export function PlanLimitGate({ children, limitKey = 'banks', fallback }: PlanLimitGateProps) {
  const { data: billing, isLoading } = useBillingPlan();

  if (isLoading || !billing) {
    return <>{children}</>;
  }

  const limit = billing.limits[limitKey] ?? Infinity;
  const usage = billing.usage[limitKey] ?? 0;
  const atLimit = Number.isFinite(limit) && usage >= limit;

  if (!atLimit) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="rounded-lg border border-card-border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Plan limit reached</p>
        <p className="text-xs text-muted mt-1">
          You&apos;re using {usage} of {limit} linked {limitKey === 'banks' ? 'banks' : 'documents'} on the{' '}
          <span className="capitalize">{billing.tier}</span> plan. Upgrade to connect more.
        </p>
      </div>
      <Link href="/app/settings">
        <Button size="sm">Upgrade plan</Button>
      </Link>
    </div>
  );
}
