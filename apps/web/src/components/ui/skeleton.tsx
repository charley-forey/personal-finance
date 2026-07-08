import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-zinc-800', className)}
      aria-hidden
      {...props}
    />
  );
}
