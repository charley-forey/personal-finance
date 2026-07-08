'use client';

import { useEventStream } from '@/hooks/use-event-stream';

export function EventStreamProvider({ children }: { children: React.ReactNode }) {
  useEventStream();
  return children;
}
