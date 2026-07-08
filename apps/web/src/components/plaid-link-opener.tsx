'use client';

import { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '@/lib/api';
import { useInvalidateFinance } from '@/hooks/use-finance';

interface PlaidLinkOpenerProps {
  linkToken: string;
  onStatus: (status: string) => void;
}

export function PlaidLinkOpener({ linkToken, onStatus }: PlaidLinkOpenerProps) {
  const invalidate = useInvalidateFinance();

  const onSuccess = useCallback(
    async (publicToken: string) => {
      onStatus('Connecting account...');
      try {
        await api.exchangeToken(publicToken);
        onStatus('Account linked! Syncing data...');
        invalidate();
        setTimeout(() => invalidate(), 3000);
      } catch {
        onStatus('Failed to exchange token');
      }
    },
    [onStatus, invalidate],
  );

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={!ready}
      className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
    >
      Connect Bank Account
    </button>
  );
}
