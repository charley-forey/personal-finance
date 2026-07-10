'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePreferences, usePlaidItems } from '@/hooks/use-finance';

/**
 * Redirects first-time users from /app to /app/onboarding when setup is incomplete
 * and no bank is linked. Soft-skip via ?skipOnboarding=1.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/app';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: prefs, isLoading: prefsLoading } = usePreferences();
  const { data: plaidItems, isLoading: itemsLoading } = usePlaidItems();

  const skipOnboarding = searchParams?.get('skipOnboarding') === '1';
  const onOnboarding = pathname === '/app/onboarding' || pathname.startsWith('/app/onboarding/');
  const onboardingCompleted =
    prefs?.onboardingCompleted === true ||
    prefs?.notificationSettingsJson?.onboardingCompleted === true;
  const hasPlaid = (plaidItems?.length ?? 0) > 0;

  useEffect(() => {
    if (prefsLoading || itemsLoading) return;
    if (skipOnboarding || onOnboarding) return;
    if (pathname !== '/app') return;
    if (onboardingCompleted || hasPlaid) return;
    router.replace('/app/onboarding');
  }, [
    prefsLoading,
    itemsLoading,
    skipOnboarding,
    onOnboarding,
    pathname,
    onboardingCompleted,
    hasPlaid,
    router,
  ]);

  return <>{children}</>;
}
