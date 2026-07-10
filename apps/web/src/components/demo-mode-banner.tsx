'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';

const DEMO_KEY = 'pf_demo_mode';

function readDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DEMO_KEY) === '1';
  } catch {
    return false;
  }
}

/** Shows when localStorage `pf_demo_mode=1` (or prefs toggle writes the same key). */
export function DemoModeBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readDemoMode());
    const onStorage = (e: StorageEvent) => {
      if (e.key === DEMO_KEY) setActive(e.newValue === '1');
    };
    const onCustom = () => setActive(readDemoMode());
    window.addEventListener('storage', onStorage);
    window.addEventListener('pf:demo-mode-change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pf:demo-mode-change', onCustom);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm"
    >
      <span className="inline-flex items-center gap-2 text-amber-200">
        <FlaskConical className="h-4 w-4 shrink-0" aria-hidden />
        Demo data — figures are sample only
      </span>
      <Link href="/app/settings" className="text-xs text-amber-200/80 hover:text-amber-100 underline">
        Manage in Settings
      </Link>
    </div>
  );
}

export function setDemoMode(enabled: boolean) {
  try {
    if (enabled) localStorage.setItem(DEMO_KEY, '1');
    else localStorage.removeItem(DEMO_KEY);
    window.dispatchEvent(new Event('pf:demo-mode-change'));
  } catch {
    /* ignore */
  }
}

export function getDemoMode(): boolean {
  return readDemoMode();
}
