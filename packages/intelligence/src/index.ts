import { INTELLIGENCE_QUALITY_GATES, type RecommendationItem } from '@pf/shared';

export { detectSpendingAnomalies, type SpendingAnomaly, type SpendingTransaction } from './anomaly';
export { scorePersonalization, type FinancialProfileInput, type PersonalizationSignals } from './personalization';
export { assignExperimentVariant, type ExperimentVariant } from './experiments';
export {
  recalibrateCategories,
  scoreForecastAccuracy,
  type CategoryCorrectionInput,
  type ForecastObservation,
  type RecalibrateCategoriesResult,
  type ScoreForecastAccuracyResult,
} from './learning-jobs';
export {
  computeCategoryConfidence,
  computeFeatureStore,
  detectProactiveTriggers,
  runEvalHarness,
  PAGE_EVAL_SCENARIOS,
  type CategoryConfidence,
  type FeatureStoreSnapshot,
  type ProactiveTrigger,
  type EvalScenario,
} from './revolution';
export {
  assertCoreGatesHealthy,
  evalHarnessSmoke,
  QUALITY_GATE_FILE,
} from './quality-gates';

export interface RankInput {
  title: string;
  body?: string;
  actionType: string;
  relevance: number;
  urgency: number;
  confidence: number;
  cognitiveLoad?: number;
}

export function computeUserValueScore(input: RankInput): number {
  const load = Math.max(input.cognitiveLoad ?? 1, 0.1);
  return (input.relevance * input.urgency * input.confidence) / load;
}

export function rankRecommendations(items: RankInput[]): RecommendationItem[] {
  return items
    .map((item, index) => ({
      id: `rec-${index}`,
      title: item.title,
      body: item.body,
      actionType: item.actionType,
      priorityScore: computeUserValueScore(item),
      confidence: item.confidence,
      status: 'pending' as const,
    }))
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));
}

export function passesQualityGate(
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
