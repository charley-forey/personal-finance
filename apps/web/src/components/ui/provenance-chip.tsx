'use client';

import Link from 'next/link';
import clsx from 'clsx';

export interface ProvenanceChipProps {
  source: string;
  detail?: string;
  syncedAt?: string | Date;
  href?: string;
  methodologyHref?: string;
  className?: string;
}

function formatSyncedAgo(syncedAt: string | Date): string {
  const ts = typeof syncedAt === 'string' ? new Date(syncedAt).getTime() : syncedAt.getTime();
  if (!Number.isFinite(ts)) return 'synced recently';
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60_000));
  if (mins < 1) return 'synced just now';
  if (mins < 60) return `synced ${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `synced ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `synced ${days}d ago`;
}

export function ProvenanceChip({
  source,
  detail,
  syncedAt,
  href,
  methodologyHref,
  className,
}: ProvenanceChipProps) {
  const parts = [`Source: ${source}`];
  if (detail) parts.push(detail);
  if (syncedAt) parts.push(formatSyncedAgo(syncedAt));
  const label = parts.join(' · ');

  const chipClass = clsx(
    'inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-card-border bg-card/80 px-2 py-0.5 text-[11px] text-muted',
    className,
  );

  const body = href ? (
    <Link href={href} className="truncate hover:text-foreground transition-colors" title={label}>
      {label}
    </Link>
  ) : (
    <span className="truncate" title={label}>
      {label}
    </span>
  );

  return (
    <span className={chipClass}>
      {body}
      {methodologyHref ? (
        <Link href={methodologyHref} className="shrink-0 text-primary hover:underline">
          How calculated
        </Link>
      ) : null}
    </span>
  );
}
