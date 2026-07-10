import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Hub back-link for leaf pages */
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: Array<{ href?: string; label: string }>;
}

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors min-h-11"
          >
            <ChevronLeft className="w-4 h-4" />
            {backLabel ?? 'Back'}
          </Link>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted mt-1 sm:mt-2 text-sm sm:text-base">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
