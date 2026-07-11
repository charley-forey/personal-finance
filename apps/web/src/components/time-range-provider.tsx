'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SegmentedControl } from '@/components/ui';

export type TimeRange = '30d' | '90d' | 'ytd' | 'month';

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'ytd', label: 'YTD' },
  { value: 'month', label: 'Month' },
];

function isTimeRange(v: string | null): v is TimeRange {
  return v === '30d' || v === '90d' || v === 'ytd' || v === 'month';
}

interface TimeRangeContextValue {
  range: TimeRange;
  setRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeContextValue | null>(null);

export function TimeRangeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromUrl = searchParams?.get('range') ?? null;
  const [range, setRangeState] = useState<TimeRange>(() =>
    isTimeRange(fromUrl) ? fromUrl : '30d',
  );

  useEffect(() => {
    if (isTimeRange(fromUrl) && fromUrl !== range) {
      setRangeState(fromUrl);
    }
  }, [fromUrl, range]);

  const setRange = useCallback(
    (next: TimeRange) => {
      setRangeState(next);
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.set('range', next);
      const qs = params.toString();
      router.replace(`${pathname ?? ''}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const value = useMemo(() => ({ range, setRange }), [range, setRange]);

  return <TimeRangeContext.Provider value={value}>{children}</TimeRangeContext.Provider>;
}

export function useTimeRange(): TimeRangeContextValue {
  const ctx = useContext(TimeRangeContext);
  if (!ctx) {
    throw new Error('useTimeRange must be used within TimeRangeProvider');
  }
  return ctx;
}

/** Compact range selector for AppShell header. Safe when provider is mounted. */
export function TimeRangeSelect({ className }: { className?: string }) {
  const { range, setRange } = useTimeRange();

  return (
    <SegmentedControl
      aria-label="Time range"
      className={className}
      options={RANGES}
      value={range}
      onChange={(v) => setRange(v as TimeRange)}
    />
  );
}
