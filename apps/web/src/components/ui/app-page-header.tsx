'use client';

import type { ReactNode } from 'react';
import { PageHeader } from './page-header';
import { usePageChrome } from '@/hooks/use-page-chrome';

export interface AppPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** When true, skip back/breadcrumb (hub roots). Default: auto from path. */
  hideWayfinding?: boolean;
}

/** PageHeader with breadcrumbs + hub back link wired from nav-config. */
export function AppPageHeader({ title, description, actions, hideWayfinding }: AppPageHeaderProps) {
  const { backHref, backLabel, breadcrumbs, pathname, hubHref } = usePageChrome();
  const isHubRoot = Boolean(hubHref && pathname === hubHref);

  if (hideWayfinding || isHubRoot) {
    return <PageHeader title={title} description={description} actions={actions} />;
  }

  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      backHref={backHref}
      backLabel={backLabel}
      breadcrumbs={breadcrumbs}
    />
  );
}
