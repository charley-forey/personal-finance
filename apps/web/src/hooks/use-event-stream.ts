'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type StreamStatus = { connected: boolean; reconnecting: boolean };

let streamStatus: StreamStatus = { connected: false, reconnecting: false };
const listeners = new Set<() => void>();

function setStreamStatus(next: StreamStatus) {
  streamStatus = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return streamStatus;
}

export function useEventStreamStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

const INVALIDATE_ALL_CONTEXT: string[][] = [['page-context'], ['graph-context'], ['recommendations'], ['narrative-session']];

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
    ['plaid-items'],
    ...INVALIDATE_ALL_CONTEXT,
  ],
  'transaction.created': [['transactions'], ['cash-flow'], ['inbox'], ['activity']],
  'transaction.updated': [['transactions'], ['inbox'], ['activity']],
  'balance.changed': [['accounts'], ['net-worth'], ['cash-flow']],
  'budget.exceeded': [['budgets'], ['budget-actuals'], ['insights']],
  'goal.achieved': [['goals'], ['insights']],
  'insight.generated': [['insights'], ['page-context'], ['recommendations']],
  'health_score.changed': [['health-score']],
  'pnl.period.closed': [['pnl']],
  'recommendation.created': [['recommendations'], ['page-context']],
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

async function consumeSse(
  url: string,
  token: string,
  onDomainEvent: (payload: { eventType?: string }) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
    },
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`SSE connect failed: ${res.status}`);
  }

  setStreamStatus({ connected: true, reconnecting: false });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let eventName = 'message';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:') && eventName === 'domain_event') {
        try {
          const payload = JSON.parse(line.slice(5).trim()) as { eventType?: string };
          onDomainEvent(payload);
        } catch {
          // ignore malformed payloads
        }
      } else if (line === '') {
        eventName = 'message';
      }
    }
  }
}

export function useEventStream() {
  const qc = useQueryClient();
  const [, setTick] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setStreamStatus({ connected: false, reconnecting: false });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    let attempt = 0;
    const MAX_BACKOFF_MS = 30_000;
    const BASE_BACKOFF_MS = 1_000;

    const connect = async () => {
      while (!cancelled) {
        try {
          setStreamStatus({ connected: streamStatus.connected, reconnecting: !streamStatus.connected });
          await consumeSse(
            `${API_URL}/events/stream`,
            token,
            (payload) => {
              if (payload.eventType) {
                invalidateForEvent(qc, payload.eventType);
              } else {
                qc.invalidateQueries();
              }
            },
            controller.signal,
          );
          // Clean close — reset backoff and reconnect
          attempt = 0;
          if (!cancelled) {
            setStreamStatus({ connected: false, reconnecting: true });
          }
        } catch {
          if (cancelled || controller.signal.aborted) return;
          setStreamStatus({ connected: false, reconnecting: true });
          setTick((t) => t + 1);
          const delay = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt);
          attempt += 1;
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    };

    void connect();

    return () => {
      cancelled = true;
      controller.abort();
      setStreamStatus({ connected: false, reconnecting: false });
    };
  }, [qc]);
}
