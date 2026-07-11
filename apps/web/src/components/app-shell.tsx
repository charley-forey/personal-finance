'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  FileText,
  Home,
  Menu,
  X,
  Inbox,
  Bot,
  Shield,
  Settings,
  Bell,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useInbox } from '@/hooks/use-finance';
import { CommandPalette, openCommandPalette } from '@/components/command-palette';
import { SyncHealthBanner } from '@/components/sync-health-banner';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { DemoModeBanner } from '@/components/demo-mode-banner';
import { GuidedTour } from '@/components/guided-tour';
import { TimeRangeProvider, TimeRangeSelect } from '@/components/time-range-provider';
import { HubAccordion, type NavIconMap } from '@/components/hub-accordion';
import { OfflineBanner } from '@/components/offline-banner';
import { ActAsBanner } from '@/components/act-as-banner';
import { MOBILE_NAV, hubActive } from '@/lib/nav-config';

const ICONS: NavIconMap = {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  FileText,
  Inbox,
  Bot,
  Shield,
  Settings,
  Bell,
  Menu,
  MoreHorizontal,
};

const PRIVACY_KEY = 'pf_privacy_blur';

function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const focusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const items = focusable();
    items[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusable();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef]);
}

function applyPrivacyBlur(enabled: boolean) {
  document.documentElement.classList.toggle('pf-privacy-blur', enabled);
}

function SearchButton({ className, label = 'Search' }: { className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => openCommandPalette()}
      aria-label="Search pages"
      className={clsx(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground min-h-11',
        className,
      )}
    >
      <Search className="w-4 h-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerTitleId = useId();
  const { data: inbox } = useInbox();
  const inboxCount = (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  useFocusTrap(menuOpen, drawerRef);

  useEffect(() => {
    try {
      applyPrivacyBlur(localStorage.getItem(PRIVACY_KEY) === '1');
    } catch {
      /* ignore */
    }
    const onPrivacy = () => {
      try {
        applyPrivacyBlur(localStorage.getItem(PRIVACY_KEY) === '1');
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('pf:privacy-blur-change', onPrivacy);
    return () => window.removeEventListener('pf:privacy-blur-change', onPrivacy);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TimeRangeProvider>
        <div className="min-h-screen bg-background">
          <a href="#main-content" className="sr-only rounded-lg bg-card text-sm shadow-lg">
            Skip to main content
          </a>
          <ActAsBanner />

          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-card-border bg-card/95 backdrop-blur px-4 py-3 safe-top md:hidden">
            <Link href="/app" className="flex items-center gap-2 font-semibold min-h-11">
              <Home className="w-5 h-5 text-primary" aria-hidden />
              Finance OS
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Search pages"
                onClick={() => openCommandPalette()}
                className="p-2 rounded-lg hover:bg-white/5 min-h-11 min-w-11 inline-flex items-center justify-center text-muted hover:text-foreground"
              >
                <Search className="w-5 h-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-drawer"
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 rounded-lg hover:bg-white/5 min-h-11 min-w-11 inline-flex items-center justify-center"
              >
                {menuOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
              </button>
            </div>
          </header>

          {menuOpen && (
            <div
              className="fixed inset-0 z-[30] bg-black/50 md:hidden"
              onClick={closeMenu}
              aria-hidden
            />
          )}

          <div className="flex min-h-[calc(100dvh-3.5rem)] md:min-h-screen">
            {/* Desktop sidebar */}
            <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-72 md:flex-col md:gap-1 md:overflow-y-auto md:border-r md:border-card-border md:bg-card md:p-4">
              <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-2 border-b border-card-border">
                <Home className="w-5 h-5 text-primary" aria-hidden />
                <span className="font-semibold text-lg">Finance OS</span>
              </Link>
              <nav aria-label="Primary" className="flex-1">
                <HubAccordion pathname={pathname} icons={ICONS} inboxCount={inboxCount} />
              </nav>
              <div className="mt-auto border-t border-card-border pt-3">
                <button
                  type="button"
                  onClick={() => openCommandPalette()}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground min-h-11"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" aria-hidden />
                    Search
                  </span>
                  <kbd className="rounded border border-card-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                </button>
              </div>
            </aside>

            {/* Mobile drawer */}
            <aside
              id="mobile-nav-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal={menuOpen || undefined}
              aria-hidden={!menuOpen}
              aria-labelledby={drawerTitleId}
              className={clsx(
                'fixed top-14 z-40 flex h-[calc(100dvh-3.5rem)] w-72 flex-col gap-1 overflow-y-auto border-r border-card-border bg-card p-4 transition-transform duration-150 md:hidden',
                menuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
              )}
            >
              <h2 id={drawerTitleId} className="sr-only">
                Navigation menu
              </h2>
              <SearchButton className="w-full mb-2 border border-card-border" label="Search pages…" />
              <nav aria-label="Primary">
                <HubAccordion
                  pathname={pathname}
                  icons={ICONS}
                  onNavigate={closeMenu}
                  inboxCount={inboxCount}
                />
              </nav>
            </aside>

            <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden">
              <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
                <TimeRangeSelect className="ml-auto" />
              </div>
              <OfflineBanner />
              <DemoModeBanner />
              <SyncHealthBanner />
              {children}
            </main>
          </div>

          <nav
            aria-label="Mobile"
            className="fixed bottom-0 inset-x-0 z-40 border-t border-card-border bg-card/95 backdrop-blur md:hidden safe-bottom"
          >
            <div className="grid grid-cols-5">
              {MOBILE_NAV.map((item) => {
                const Icon = ICONS[item.icon];
                const active = item.opensMore
                  ? menuOpen
                  : hubActive(pathname, item.href) || pathname === item.href;

                if (item.opensMore) {
                  return (
                    <button
                      key={item.href}
                      type="button"
                      aria-label="More"
                      aria-expanded={menuOpen}
                      aria-controls="mobile-nav-drawer"
                      onClick={() => (menuOpen ? closeMenu() : openMenu())}
                      className={clsx(
                        'flex flex-col items-center justify-center gap-1 min-h-11 py-2 text-xs',
                        active ? 'text-primary' : 'text-muted',
                      )}
                    >
                      <Icon className="w-5 h-5" aria-hidden />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'flex flex-col items-center justify-center gap-1 min-h-11 py-2 text-xs',
                      active ? 'text-primary' : 'text-muted',
                    )}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                    <span>{item.label}</span>
                    {item.href === '/app/inbox' && inboxCount > 0 && (
                      <span className="sr-only">{inboxCount} items</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <CommandPalette />
          <GuidedTour />
          <PwaInstallPrompt />
        </div>
      </TimeRangeProvider>
    </Suspense>
  );
}

/** @deprecated Prefer `@/components/ui` — re-exported for existing page imports. */
export { Card, PageHeader } from '@/components/ui';
