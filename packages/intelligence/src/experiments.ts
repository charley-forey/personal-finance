import { createHash } from 'crypto';

export type ExperimentVariant = 'control' | 'treatment';

export function assignExperimentVariant(userId: string, experimentId: string): ExperimentVariant {
  const hash = createHash('sha256').update(`${userId}:${experimentId}`).digest('hex');
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  return bucket < 50 ? 'control' : 'treatment';
}
