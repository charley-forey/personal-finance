'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { PageRevolutionShell } from '@/components/page-revolution-shell';
import { OnboardingGate } from '@/components/onboarding-gate';

const HUB_ROUTES = new Set(['/app/cash-flow', '/app/plan', '/app/wealth', '/app/future', '/app/library']);

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/app';
  if (HUB_ROUTES.has(pathname)) {
    return <>{children}</>;
  }
  return <PageRevolutionShell route={pathname}>{children}</PageRevolutionShell>;
}

export function AppRevolutionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AppShellContent>{children}</AppShellContent>}>
      <OnboardingGate>
        <AppShellContent>{children}</AppShellContent>
      </OnboardingGate>
    </Suspense>
  );
}
