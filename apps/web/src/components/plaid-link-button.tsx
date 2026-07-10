'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { PlanLimitGate } from '@/components/plan-limit-gate';

const PlaidLinkOpener = dynamic(
  () => import('./plaid-link-opener').then((m) => m.PlaidLinkOpener),
  {
    ssr: false,
    loading: () => (
      <button type="button" disabled className="px-4 py-2 bg-primary/50 text-black font-medium rounded-lg">
        Loading Plaid...
      </button>
    ),
  },
);

interface PlaidLinkButtonProps {
  onLinked?: () => void;
}

function PlaidLinkButtonInner({ onLinked }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLinkToken = useCallback(async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await api.linkToken();
      setLinkToken(res.linkToken);
    } catch {
      setStatus('Failed to get link token. Sign in and ensure the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {!linkToken ? (
        <button
          type="button"
          onClick={fetchLinkToken}
          disabled={loading}
          className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Preparing...' : 'Prepare Bank Link'}
        </button>
      ) : (
        <PlaidLinkOpener linkToken={linkToken} onStatus={setStatus} onLinked={onLinked} />
      )}
      {status && <p className="text-sm text-muted">{status}</p>}
    </div>
  );
}

export function PlaidLinkButton({ onLinked }: PlaidLinkButtonProps) {
  return (
    <PlanLimitGate limitKey="banks">
      <PlaidLinkButtonInner onLinked={onLinked} />
    </PlanLimitGate>
  );
}
