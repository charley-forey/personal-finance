import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: ReactNode;
  change?: {
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  };
  /** Optional trust/provenance footer (e.g. ProvenanceChip). */
  provenance?: ReactNode;
  className?: string;
}

const trendStyles = {
  up: 'text-success',
  down: 'text-danger',
  neutral: 'text-muted',
} as const;

export function StatCard({ title, value, change, provenance, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-card-border bg-card p-4 sm:p-6',
        className,
      )}
    >
      <p className="text-xs sm:text-sm text-muted">{title}</p>
      <p className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums">{value}</p>
      {change && (
        <p className={clsx('mt-1 text-xs', trendStyles[change.trend ?? 'neutral'])}>
          {change.value}
        </p>
      )}
      {provenance ? <div className="mt-3 pt-2 border-t border-card-border/60">{provenance}</div> : null}
    </div>
  );
}
