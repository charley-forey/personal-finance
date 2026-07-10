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
  ChevronDown,
  Bell,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useInbox } from '@/hooks/use-finance';
import { Badge } from '@/components/ui';
import { CommandPalette, openCommandPalette } from '@/components/command-palette';
import { SyncHealthBanner } from '@/components/sync-health-banner';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { DemoModeBanner } from '@/components/demo-mode-banner';
import { GuidedTour } from '@/components/guided-tour';
import { TimeRangeProvider, TimeRangeSelect } from '@/components/time-range-provider';
import {
  COMMAND_LINKS,
  HUB_NAV,
  MOBILE_NAV,
  MORE_SECTIONS,
  getHubForPath,
  hubActive,
  type NavIconName,
} from '@/lib/nav-config';

const ICONS: Record<NavIconName, LucideIcon> = {
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

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
  badge,
  indent,
}: {
  href: string;
  label: string;
  icon: NavIconName;
  active: boolean;
  onClick?: () => void;
  badge?: number;
  indent?: boolean;
}) {
  const Icon = ICONS[icon];
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors min-h-11',
        indent && 'pl-9',
        active ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground hover:bg-white/5',
      )}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden />
      <span className="truncate flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="warning" className="ml-auto shrink-0">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(true);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerTitleId = useId();
  const { data: inbox } = useInbox();
  const inboxCount = (inbox?.uncategorized.length ?? 0) + (inbox?.anomalies.length ?? 0);
  const hub = getHubForPath(pathname);

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

  // Close drawer on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  function renderHubNav(onNavigate?: () => void) {
    return HUB_NAV.map((item) => (
      <div key={item.href}>
        <NavLink
          {...item}
          active={hubActive(pathname, item.href)}
          onClick={onNavigate}
          badge={item.href === '/app' ? inboxCount : undefined}
        />
        {item.href === '/app' && hubActive(pathname, '/app') && (
          <>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted hover:text-foreground min-h-11"
              onClick={() => setCommandOpen((v) => !v)}
              aria-expanded={commandOpen}
            >
              <ChevronDown className={clsx('w-3 h-3 transition', commandOpen && 'rotate-180')} aria-hidden />
              Command pages
            </button>
            {commandOpen &&
              COMMAND_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  indent
                  active={pathname === link.href}
                  onClick={onNavigate}
                  badge={link.href === '/app/inbox' ? inboxCount : undefined}
                />
              ))}
          </>
        )}
      </div>
    ));
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TimeRangeProvider>
        <div className="min-h-screen bg-background">
          <a href="#main-content" className="sr-only rounded-lg bg-card text-sm shadow-lg">
            Skip to main content
          </a>

          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-card-border bg-card/95 backdrop-blur px-4 py-3 md:hidden">
            <Link href="/app" className="flex items-center gap-2 font-semibold min-h-11">
              <Home className="w-5 h-5 text-primary" aria-hidden />
              Finance OS
            </Link>
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
          </header>

          {menuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={closeMenu}
              aria-hidden
            />
          )}

          <div className="flex min-h-[calc(100vh-3.5rem)] md:min-h-screen">
            {/* Desktop sidebar */}
            <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-72 md:flex-col md:gap-1 md:overflow-y-auto md:border-r md:border-card-border md:bg-card md:p-4">
              <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-2">
                <Home className="w-5 h-5 text-primary" aria-hidden />
                <span className="font-semibold text-lg">Finance OS</span>
              </Link>
              <nav aria-label="Primary" className="flex-1">
                {renderHubNav()}
              </nav>
              <div className="mt-auto border-t border-card-border pt-3">
                <button
                  type="button"
                  onClick={() => openCommandPalette()}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground min-h-11"
                >
                  <span>Search</span>
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
                'fixed top-14 z-30 flex h-[calc(100vh-3.5rem)] w-72 flex-col gap-1 overflow-y-auto border-r border-card-border bg-card p-4 transition-transform md:hidden',
                menuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
              )}
            >
              <h2 id={drawerTitleId} className="sr-only">
                Navigation menu
              </h2>
              <nav aria-label="Primary">{renderHubNav(closeMenu)}</nav>
              <div className="mt-4 border-t border-card-border pt-4 space-y-4">
                {MORE_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                      {section.title}
                    </p>
                    <nav aria-label={section.title}>
                      {section.links.map((link) => (
                        <NavLink
                          key={`more-${section.title}-${link.href}`}
                          {...link}
                          active={pathname === link.href || hubActive(pathname, link.href)}
                          onClick={closeMenu}
                          badge={link.href === '/app/inbox' ? inboxCount : undefined}
                        />
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </aside>

            <main id="main-content" className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                {hub && (
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                    {hub.label}
                  </span>
                )}
                <TimeRangeSelect className="ml-auto" />
              </div>
              <DemoModeBanner />
              <SyncHealthBanner />
              {children}
            </main>
          </div>

          <nav aria-label="Mobile" className="fixed bottom-0 inset-x-0 z-40 border-t border-card-border bg-card/95 backdrop-blur md:hidden safe-bottom">
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
