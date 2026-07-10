'use client';

import { usePathname } from 'next/navigation';
import { getBreadcrumbs, getHubBackLink, getHubForPath } from '@/lib/nav-config';

/** Auto wayfinding for leaf pages from nav-config. */
export function usePageChrome() {
  const pathname = usePathname() ?? '/app';
  const back = getHubBackLink(pathname);
  const breadcrumbs = getBreadcrumbs(pathname);
  const hub = getHubForPath(pathname);

  return {
    pathname,
    hub,
    hubLabel: hub?.label ?? null,
    hubHref: hub?.href ?? null,
    backHref: back?.href,
    backLabel: back?.label,
    breadcrumbs,
  };
}
