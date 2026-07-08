'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { api, setAuthToken } from '@/lib/api';

export function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('pf_token');
    if (!token) {
      api
        .createSession({ workosUserId: 'demo-user', email: 'demo@example.com', name: 'Demo User' })
        .then((res) => setAuthToken(res.token))
        .catch(console.error);
    } else {
      setAuthToken(token);
    }
  }, []);

  const fetchLinkToken = useCallback(async () => {
    try {
      const res = await api.linkToken();
      setLinkToken(res.linkToken);
    } catch (e) {
      setStatus('Failed to get link token. Is the API running?');
    }
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    setStatus('Connecting account...');
    try {
      await api.exchangeToken(publicToken);
      setStatus('Account linked successfully!');
    } catch {
      setStatus('Failed to exchange token');
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="flex flex-col gap-2">
      {!linkToken ? (
        <button
          onClick={fetchLinkToken}
          className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90"
        >
          Prepare Bank Link
        </button>
      ) : (
        <button
          onClick={() => open()}
          disabled={!ready}
          className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          Connect Bank Account
        </button>
      )}
      {status && <p className="text-sm text-muted">{status}</p>}
    </div>
  );
}
