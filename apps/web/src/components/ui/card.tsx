import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children, className, ...props }: CardProps) {
  return (
    <div className={clsx('rounded-xl border border-card-border bg-card p-4 sm:p-6', className)} {...props}>
      {title && <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>}
      {children}
    </div>
  );
}
