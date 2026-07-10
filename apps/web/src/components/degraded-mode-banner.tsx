'use client';

import { BotOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Degraded-mode banners from platform feature flags.
 * Sync issues are handled by SyncHealthBanner (mounted above this).
 */
export function DegradedModeBanner() {
  const { data: flags } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => api.featureFlags(),
    staleTime: 60_000,
    retry: 1,
  });

  if (flags?.ai_agents !== false) return null;

  return (
    <div
      role="status"
      className="mb-4 rounded-lg border border-card-border bg-card px-4 py-3 text-sm flex items-start gap-3"
    >
      <BotOff className="w-5 h-5 text-muted shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="font-medium">AI features temporarily off</p>
        <p className="text-muted text-xs mt-0.5">
          Agents and AI insights are disabled for your organization. Core finance tools still work.
        </p>
      </div>
    </div>
  );
}
