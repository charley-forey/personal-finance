'use client';

import { PageContextBanner } from '@/components/page-context-banner';
import { EntityGraphPanel } from '@/components/entity-graph-panel';

interface PageRevolutionShellProps {
  route: string;
  entityType?: string;
  entityId?: string;
  children: React.ReactNode;
  showGraph?: boolean;
}

/** Wave 10 wrapper: context banner + optional graph panel for every page */
export function PageRevolutionShell({
  route,
  entityType,
  entityId,
  children,
  showGraph = true,
}: PageRevolutionShellProps) {
  return (
    <div className="space-y-6">
      <PageContextBanner />
      <div className={showGraph ? 'grid gap-6 lg:grid-cols-[1fr_240px]' : ''}>
        <div className="space-y-6 min-w-0">{children}</div>
        {showGraph && (
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <EntityGraphPanel entityType={entityType} entityId={entityId} route={route} />
          </aside>
        )}
      </div>
    </div>
  );
}
