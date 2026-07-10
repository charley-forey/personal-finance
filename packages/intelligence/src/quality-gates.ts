/**
 * Intelligence quality gates — CI-friendly mirror of docs/planning/INTELLIGENCE-QUALITY-GATES.md
 * and @pf/shared INTELLIGENCE_QUALITY_GATES.
 */
import { INTELLIGENCE_QUALITY_GATES } from '@pf/shared';
import { runEvalHarness, PAGE_EVAL_SCENARIOS } from './revolution';

export const QUALITY_GATE_FILE = 'packages/intelligence/src/quality-gates.ts';

function gatePass(
  metric: keyof typeof INTELLIGENCE_QUALITY_GATES,
  value: number,
): boolean {
  const thresholds = INTELLIGENCE_QUALITY_GATES;
  switch (metric) {
    case 'factualAccuracyPct':
    case 'categorizationAccuracyPct':
    case 'insightAcceptancePct':
      return value >= thresholds[metric];
    case 'forecastMapePct':
    case 'hallucinationRatePct':
    case 'agentLatencyP95Ms':
    case 'llmCostPerProUserUsd':
      return value <= thresholds[metric];
    default:
      return false;
  }
}

export function assertCoreGatesHealthy(sample: {
  factualAccuracyPct: number;
  forecastMapePct: number;
  insightAcceptancePct: number;
}): boolean {
  return (
    gatePass('factualAccuracyPct', sample.factualAccuracyPct) &&
    gatePass('forecastMapePct', sample.forecastMapePct) &&
    gatePass('insightAcceptancePct', sample.insightAcceptancePct)
  );
}

export function evalHarnessSmoke(): number {
  const scenario = PAGE_EVAL_SCENARIOS[0]!;
  return runEvalHarness('dashboard headline for the week', scenario);
}

export { INTELLIGENCE_QUALITY_GATES };
