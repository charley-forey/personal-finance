'use client';

import { OnboardingGate } from '@/components/onboarding-gate';
import { Suspense } from 'react';

/** Pass-through wrapper — Wave 10 banner/graph chrome removed. Keeps onboarding gate. */
export function AppRevolutionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <OnboardingGate>{children}</OnboardingGate>
    </Suspense>
  );
}
