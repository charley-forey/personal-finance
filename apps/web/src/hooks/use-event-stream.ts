'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const EVENT_QUERY_KEYS: Record<string, string[][]> = {
  'plaid.item.linked': [['plaid-items'], ['accounts']],
  'plaid.sync.completed': [
    ['accounts'],
    ['transactions'],
    ['net-worth'],
    ['cash-flow'],
    ['recurring'],
    ['liabilities'],
    ['holdings'],
    ['activity'],
    ['inbox'],
  ],
  'transaction.created': [['transactions'], ['cash-flow'], ['inbox'], ['activity']],
  'transaction.updated': [['transactions'], ['inbox'], ['activity']],
  'balance.changed': [['accounts'], ['net-worth'], ['cash-flow']],
  'budget.exceeded': [['budgets'], ['budget-actuals'], ['insights']],
  'goal.achieved': [['goals'], ['insights']],
  'insight.generated': [['insights']],
  'health_score.changed': [['health-score']],
  'pnl.period.closed': [['pnl']],
};

function invalidateForEvent(qc: ReturnType<typeof useQueryClient>, eventType: string) {
  const keys = EVENT_QUERY_KEYS[eventType];
  if (keys) {
    for (const queryKey of keys) {
      qc.invalidateQueries({ queryKey });
    }
    return;
  }
  qc.invalidateQueries();
}

export function useEventStream() {
  const qc = useQueryClient();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const url = `${API_URL}/events/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.addEventListener('domain_event', (msg) => {
      try {
        const payload = JSON.parse(msg.data) as { eventType?: string };
        if (payload.eventType) {
          invalidateForEvent(qc, payload.eventType);
        } else {
          qc.invalidateQueries();
        }
      } catch {
        qc.invalidateQueries();
      }
    });

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [qc]);
}
