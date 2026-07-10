'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePageContext } from '@/hooks/use-finance';
import { Button, Badge, Skeleton } from '@/components/ui';

export function PageContextBanner() {
  const pathname = usePathname();
  const { data, isLoading } = usePageContext(pathname ?? '/app');

  if (isLoading) return <Skeleton className="h-20 w-full rounded-lg" />;
  if (!data) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{data.headline}</p>
          {data.alerts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.alerts.map((a) => (
                <Badge key={a.id} variant={a.severity === 'critical' ? 'warning' : 'info'}>
                  {a.message}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      {data.priorityItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.priorityItems.slice(0, 3).map((item) => (
            <Link key={item.id} href={item.deepLink}>
              <Button size="sm" variant="secondary">
                {item.actionLabel ?? item.title}
              </Button>
            </Link>
          ))}
        </div>
      )}
      {data.relatedPages.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          {data.relatedPages.slice(0, 3).map((p) => (
            <Link key={p.route} href={p.route} className="hover:text-primary" title={p.reason}>
              {p.label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
