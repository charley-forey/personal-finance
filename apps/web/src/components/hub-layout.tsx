'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useJourneyProgress } from '@/hooks/use-finance';
import { Skeleton } from '@/components/ui';
import { CheckCircle2, Circle } from 'lucide-react';
import { PanelErrorBoundary } from '@/components/panel-error-boundary';
import { getHubChildren } from '@/lib/nav-config';

interface JourneyChecklistProps {
  hubId: string;
}

export function JourneyChecklist({ hubId }: JourneyChecklistProps) {
  const { data, isLoading } = useJourneyProgress();
  const hub = data?.hubs.find((h) => h.hubId === hubId);

  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (!hub || hub.completedCount === hub.totalCount) return null;

  return (
    <div className="rounded-xl border border-card-border/60 p-4 space-y-2" aria-label={`${hub.label} journey progress`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Your {hub.label} journey</p>
        <span className="text-xs text-muted">
          {hub.completedCount}/{hub.totalCount} complete
        </span>
      </div>
      <ul className="space-y-1">
        {hub.steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-hidden />
            ) : (
              <Circle className="w-4 h-4 text-muted shrink-0" aria-hidden />
            )}
            {step.completed ? (
              <span className="text-muted line-through">
                <span className="sr-only">Completed: </span>
                {step.label}
              </span>
            ) : (
              <Link href={step.route} className="hover:text-primary">
                <span className="sr-only">Todo: </span>
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface HubLayoutProps {
  title: string;
  description: string;
  hubId: string;
  /** Hub path used to resolve children from nav-config (e.g. `/app/cash-flow`). */
  hubHref: string;
  children: React.ReactNode;
  /** Optional per-href descriptions for hub cards. */
  linkDescriptions?: Record<string, string>;
  /** One-line first job CTA shown above children when provided. */
  firstJob?: { href: string; label: string; description: string };
}

export function HubLayout({
  title,
  description,
  hubId,
  hubHref,
  children,
  linkDescriptions,
  firstJob,
}: HubLayoutProps) {
  const links = useMemo(
    () =>
      getHubChildren(hubHref).map((c) => ({
        href: c.href,
        label: c.label,
        description: linkDescriptions?.[c.href],
      })),
    [hubHref, linkDescriptions],
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted mt-1">{description}</p>
      </div>
      <JourneyChecklist hubId={hubId} />
      {firstJob && (
        <Link
          href={firstJob.href}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:border-primary/50 transition-colors"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">First job</p>
            <p className="font-medium mt-0.5">{firstJob.label}</p>
            <p className="text-xs text-muted mt-1">{firstJob.description}</p>
          </div>
          <span className="text-sm text-primary shrink-0">Go →</span>
        </Link>
      )}
      <PanelErrorBoundary>{children}</PanelErrorBoundary>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-card-border/60 p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-medium">{link.label}</p>
            {link.description && <p className="text-xs text-muted mt-1">{link.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
