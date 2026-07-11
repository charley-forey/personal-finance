'use client';

/**
 * @deprecated Wave 10 page chrome (context banner + entity graph) removed from the app shell.
 * Prefer rendering page content directly. Kept as a pass-through for any lingering imports.
 */
export function PageRevolutionShell({
  children,
}: {
  route?: string;
  entityType?: string;
  entityId?: string;
  children: React.ReactNode;
  showGraph?: boolean;
}) {
  return <>{children}</>;
}
