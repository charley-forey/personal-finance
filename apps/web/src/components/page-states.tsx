import clsx from 'clsx';
import { Card } from '@/components/app-shell';
import { Skeleton } from '@/components/ui';

export type PageLoadingVariant = 'stats' | 'list' | 'cards' | 'chart' | 'table';

export interface PageLoadingProps {
  variant?: PageLoadingVariant;
  /** Number of skeleton rows/cards (defaults vary by variant). */
  count?: number;
  className?: string;
}

const defaultCounts: Record<PageLoadingVariant, number> = {
  stats: 4,
  list: 4,
  cards: 3,
  chart: 1,
  table: 5,
};

export function PageLoading({ variant = 'list', count, className }: PageLoadingProps) {
  const n = count ?? defaultCounts[variant];

  if (variant === 'stats') {
    return (
      <div className={clsx('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4', className)}>
        {Array.from({ length: n }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={clsx('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: n }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={clsx('space-y-4', className)}>
        <PageLoading variant="stats" count={Math.min(n, 4)} />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={clsx('space-y-2', className)}>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: n }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: n }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export interface PageErrorProps {
  message: string;
  className?: string;
}

export function PageError({ message, className }: PageErrorProps) {
  return (
    <Card className={clsx('mb-6 border-danger/50', className)}>
      <p className="text-danger text-sm">{message}</p>
    </Card>
  );
}
