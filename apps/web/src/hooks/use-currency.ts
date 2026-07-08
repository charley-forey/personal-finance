'use client';

import { useCallback } from 'react';
import { usePreferences } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/format';

export function useCurrency(): string {
  const { data: prefs } = usePreferences();
  return prefs?.currency ?? 'USD';
}

export function useFormatCurrency() {
  const currency = useCurrency();
  return useCallback(
    (amount: number | string) => formatCurrency(amount, currency),
    [currency],
  );
}
