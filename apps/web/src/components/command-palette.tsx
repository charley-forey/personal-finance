'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { getAllNavPages, type NavItem } from '@/lib/nav-config';
import { trackUxMetric } from '@/lib/analytics';

const RECENT_KEY = 'pf_recent_pages';
const OPEN_EVENT = 'pf:open-command-palette';
const MAX_RECENT = 8;

const ACTIONS: NavItem[] = [
  { href: '/app/accounts', label: 'Link bank', icon: 'Wallet' },
  { href: '/app/budgets', label: 'Create budget', icon: 'PieChart' },
  { href: '/app/onboarding', label: 'Setup', icon: 'FileText' },
  { href: '/app/inbox', label: 'Open inbox', icon: 'Inbox' },
];

type PaletteItem = NavItem & { section: 'Pages' | 'Actions' | 'Recent' };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function readRecent(): NavItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NavItem[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function pushRecent(item: NavItem) {
  if (typeof window === 'undefined') return;
  try {
    const prev = readRecent().filter((p) => p.href !== item.href);
    const next = [item, ...prev].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<NavItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const pages = useMemo(() => getAllNavPages(), []);

  // Track recent pages on navigate
  useEffect(() => {
    if (!pathname || !pathname.startsWith('/app')) return;
    const match = pages.find((p) => p.href === pathname);
    if (!match) return;
    pushRecent(match);
    setRecent(readRecent());
  }, [pathname, pages]);

  const items = useMemo((): PaletteItem[] => {
    const q = query.trim().toLowerCase();
    const match = (p: NavItem) =>
      !q || p.label.toLowerCase().includes(q) || p.href.toLowerCase().includes(q);

    const result: PaletteItem[] = [];

    if (!q) {
      for (const p of recent) {
        if (pages.some((x) => x.href === p.href) || ACTIONS.some((x) => x.href === p.href)) {
          result.push({ ...p, section: 'Recent' });
        }
      }
    }

    for (const a of ACTIONS) {
      if (match(a)) result.push({ ...a, section: 'Actions' });
    }

    for (const p of pages) {
      if (match(p)) result.push({ ...p, section: 'Pages' });
    }

    return result;
  }, [pages, query, recent]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const navigate = useCallback(
    (item: NavItem) => {
      pushRecent(item);
      setRecent(readRecent());
      close();
      router.push(item.href);
    },
    [close, router],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => {
      setRecent(readRecent());
      setOpen(true);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    void trackUxMetric('search_open');
    setRecent(readRecent());
    setActiveIndex(0);
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => inputRef.current?.focus(), 0);

    const focusables = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus?.();
    };
  }, [open, close]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  let lastSection: string | null = null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-start sm:justify-center sm:p-4 sm:pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        className="relative z-10 flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl border border-card-border bg-card shadow-xl outline-none sm:rounded-xl"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-card-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[activeIndex];
                if (item) navigate(item);
              }
            }}
            placeholder="Search pages and actions…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={
              items[activeIndex] ? `command-item-${activeIndex}` : undefined
            }
          />
          <kbd className="hidden sm:inline rounded border border-card-border px-1.5 py-0.5 text-[10px] text-muted">
            Esc
          </kbd>
        </div>
        <ul
          id="command-palette-results"
          ref={listRef}
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto p-2"
        >
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">
              No matching pages. Browse hubs in the sidebar or More menu.
            </li>
          )}
          {items.map((item, index) => {
            const showHeader = item.section !== lastSection;
            lastSection = item.section;
            return (
              <li key={`${item.section}-${item.href}`} role="option" aria-selected={index === activeIndex}>
                {showHeader && (
                  <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wide text-muted">
                    {item.section === 'Recent' ? 'Recent pages' : item.section}
                  </p>
                )}
                <button
                  type="button"
                  id={`command-item-${index}`}
                  data-index={index}
                  className={clsx(
                    'flex w-full min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    index === activeIndex
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-white/5',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(item)}
                >
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="hidden shrink-0 truncate text-xs text-muted sm:inline max-w-[40%]">
                    {item.href}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Dispatch to open the command palette from outside (e.g. sidebar ⌘K hint). */
export function openCommandPalette() {
  document.dispatchEvent(new Event(OPEN_EVENT));
}
