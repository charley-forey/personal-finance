'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui';

const TOUR_KEY = 'pf_tour_command_done';

const STEPS = [
  {
    title: 'Command center',
    body: 'Your Action Queue surfaces the highest-priority money tasks first.',
  },
  {
    title: 'Find anything fast',
    body: 'Press ⌘K (or Ctrl+K) to jump to pages and common actions.',
  },
  {
    title: 'Inbox & hubs',
    body: 'Clear uncategorized items in Inbox, then explore Cash Flow, Plan, and Wealth.',
  },
];

export function GuidedTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(TOUR_KEY) === '1') return;
      setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-label="Guided tour"
      className="fixed bottom-20 right-4 z-50 w-[min(100%-2rem,20rem)] rounded-xl border border-card-border bg-card p-4 shadow-xl md:bottom-6"
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
        Step {step + 1} of {STEPS.length}
      </p>
      <h3 className="mt-1 text-sm font-semibold">{current.title}</h3>
      <p className="mt-1 text-sm text-muted">{current.body}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Skip
        </Button>
        <div className="flex gap-2">
          {step > 0 && (
            <Button size="sm" variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              if (isLast) dismiss();
              else setStep((s) => s + 1);
            }}
          >
            {isLast ? 'Done' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
