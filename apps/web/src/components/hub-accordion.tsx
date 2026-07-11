'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Badge } from '@/components/ui';
import {
  getHubNav,
  hubActive,
  isNavLeafActive,
  type HubNavItem,
  type NavIconName,
  type NavItem,
} from '@/lib/nav-config';
import { usePlatformAdmin } from '@/hooks/use-platform-admin';

const OPEN_KEY = 'pf_nav_open';

export type NavIconMap = Record<NavIconName, LucideIcon>;

function readOpenSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(OPEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeOpenSet(open: Set<string>) {
  try {
    sessionStorage.setItem(OPEN_KEY, JSON.stringify([...open]));
  } catch {
    /* ignore */
  }
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
  badge,
  indent,
  icons,
}: {
  href: string;
  label: string;
  icon: NavIconName;
  active: boolean;
  onClick?: () => void;
  badge?: number;
  indent?: boolean;
  icons: NavIconMap;
}) {
  const Icon = icons[icon];
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors min-h-11',
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

function HubSection({
  hub,
  pathname,
  icons,
  onNavigate,
  inboxCount,
  open,
  onToggle,
}: {
  hub: HubNavItem;
  pathname: string;
  icons: NavIconMap;
  onNavigate?: () => void;
  inboxCount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const Icon = icons[hub.icon];
  const hubIsActive = hubActive(pathname, hub.href, [hub]);
  const hubRootActive = pathname === hub.href;

  return (
    <div>
      <div
        className={clsx(
          'flex items-center rounded-lg min-h-11',
          hubRootActive && 'bg-primary/10',
        )}
      >
        <Link
          href={hub.href}
          prefetch
          onClick={onNavigate}
          aria-current={hubRootActive ? 'page' : undefined}
          className={clsx(
            'flex flex-1 items-center gap-2.5 px-3 py-2 text-sm transition-colors min-h-11 rounded-lg',
            hubRootActive
              ? 'text-primary'
              : hubIsActive
                ? 'text-foreground'
                : 'text-muted hover:text-foreground hover:bg-white/5',
          )}
        >
          <Icon className="w-4 h-4 shrink-0" aria-hidden />
          <span className="truncate flex-1">{hub.label}</span>
          {hub.href === '/app' && inboxCount > 0 && (
            <Badge variant="warning" className="shrink-0">
              {inboxCount}
            </Badge>
          )}
        </Link>
        {hub.children.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${hub.label}`}
            onClick={onToggle}
            className="shrink-0 p-2 mr-1 rounded-lg text-muted hover:text-foreground hover:bg-white/5 min-h-11 min-w-11 inline-flex items-center justify-center"
          >
            <ChevronDown
              className={clsx('w-4 h-4 transition-transform duration-150', open && 'rotate-180')}
              aria-hidden
            />
          </button>
        )}
      </div>
      {hub.children.length > 0 && (
        <div
          id={panelId}
          role="region"
          aria-label={`${hub.label} pages`}
          className={clsx(
            'grid transition-[grid-template-rows,opacity] duration-150',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            {hub.children.map((link: NavItem) => (
              <NavLink
                key={link.href}
                {...link}
                icons={icons}
                indent
                active={isNavLeafActive(pathname, link.href)}
                onClick={onNavigate}
                badge={link.href === '/app/inbox' ? inboxCount : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function HubAccordion({
  pathname,
  icons,
  onNavigate,
  inboxCount = 0,
}: {
  pathname: string;
  icons: NavIconMap;
  onNavigate?: () => void;
  inboxCount?: number;
}) {
  const { isPlatformAdmin } = usePlatformAdmin();
  const hubs = useMemo(() => getHubNav(isPlatformAdmin), [isPlatformAdmin]);
  const [openHubs, setOpenHubs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const stored = readOpenSet();
    const next = new Set(stored);
    for (const hub of hubs) {
      if (hubActive(pathname, hub.href, hubs)) next.add(hub.href);
    }
    setOpenHubs(next);
  }, [pathname, hubs]);

  const toggle = useCallback((href: string) => {
    setOpenHubs((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      writeOpenSet(next);
      return next;
    });
  }, []);

  return (
    <>
      {hubs.map((hub) => (
        <HubSection
          key={hub.href}
          hub={hub}
          pathname={pathname}
          icons={icons}
          onNavigate={onNavigate}
          inboxCount={inboxCount}
          open={openHubs.has(hub.href)}
          onToggle={() => toggle(hub.href)}
        />
      ))}
    </>
  );
}
