import { api } from '@/lib/api';

/** Completes a journey step; swallows errors so UI actions never fail on progress write-back. */
export async function completeJourneyStepSafe(hubId: string, stepId: string): Promise<void> {
  try {
    await api.completeJourneyStep(hubId, stepId);
  } catch {
    // Journey progress is best-effort
  }
}
