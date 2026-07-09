'use client';

import { usePathname } from 'next/navigation';
import { PageRevolutionShell } from '@/components/page-revolution-shell';

const HUB_ROUTES = new Set(['/app/cash-flow', '/app/plan', '/app/wealth', '/app/future', '/app/library']);

export function AppRevolutionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/app';
  if (HUB_ROUTES.has(pathname)) {
    return <>{children}</>;
  }
  return <PageRevolutionShell route={pathname}>{children}</PageRevolutionShell>;
}
