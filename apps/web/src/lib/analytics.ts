import { api } from '@/lib/api';

/**
 * Lightweight WVA (Weekly Valuable Action) signal tracker.
 * Posts to /signals via api.recordSignal; falls back to console in non-browser or on failure.
 */
export async function trackWva(action: string, props?: Record<string, unknown>): Promise<void> {
  const payload = { ...(props ?? {}), action, at: new Date().toISOString() };
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug('[wva]', action, props ?? {});
  }
  try {
    await api.recordSignal({
      signalType: `wva.${action}`,
      entityType: typeof props?.entityType === 'string' ? props.entityType : undefined,
      entityId: typeof props?.entityId === 'string' ? props.entityId : undefined,
      payload,
    });
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.warn('[wva] failed to record signal', action, err);
    }
  }
}

/** UX funnel metrics for the weekly scorecard. */
export async function trackUxMetric(
  metric:
    | 'time_to_first_link'
    | 'time_to_first_action'
    | 'action_queue_complete'
    | 'search_open'
    | 'dead_end_back'
    | 'onboarding_complete'
    | 'categorize',
  props?: Record<string, unknown>,
): Promise<void> {
  return trackWva(`ux.${metric}`, props);
}
