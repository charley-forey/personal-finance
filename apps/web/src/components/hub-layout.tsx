'use client';

import Link from 'next/link';
import { useJourneyProgress } from '@/hooks/use-finance';
import { Skeleton } from '@/components/ui';
import { CheckCircle2, Circle } from 'lucide-react';

interface JourneyChecklistProps {
  hubId: string;
}

export function JourneyChecklist({ hubId }: JourneyChecklistProps) {
  const { data, isLoading } = useJourneyProgress();
  const hub = data?.hubs.find((h) => h.hubId === hubId);

  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (!hub || hub.completedCount === hub.totalCount) return null;

  return (
    <div className="rounded-lg border border-border/60 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Your {hub.label} journey</p>
        <span className="text-xs text-muted-foreground">
          {hub.completedCount}/{hub.totalCount}
        </span>
      </div>
      <ul className="space-y-1">
        {hub.steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            {step.completed ? (
              <span className="text-muted-foreground line-through">{step.label}</span>
            ) : (
              <Link href={step.route} className="hover:text-primary">
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
  children: React.ReactNode;
  links: { href: string; label: string; description?: string }[];
}

export function HubLayout({ title, description, hubId, children, links }: HubLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <JourneyChecklist hubId={hubId} />
      {children}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border/60 p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-medium">{link.label}</p>
            {link.description && <p className="text-xs text-muted-foreground mt-1">{link.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
