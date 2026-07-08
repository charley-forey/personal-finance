export interface FinancialProfileInput {
  lifeStage?: string | null;
  riskTolerance?: string | null;
  filingStatus?: string | null;
  dependents?: number | null;
  annualIncome?: string | number | null;
  stateCode?: string | null;
  goalsSummary?: string | null;
}

export interface PersonalizationSignals {
  recentSignalCount?: number;
  dismissedInsightCount?: number;
  acceptedRecommendationCount?: number;
  preferredActionTypes?: string[];
}

const PROFILE_FIELDS: Array<keyof FinancialProfileInput> = [
  'lifeStage',
  'riskTolerance',
  'filingStatus',
  'dependents',
  'annualIncome',
  'stateCode',
  'goalsSummary',
];

function profileCompleteness(profile: FinancialProfileInput | null | undefined): number {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  }).length;
  return filled / PROFILE_FIELDS.length;
}

function signalEngagement(signals: PersonalizationSignals): number {
  const signalCount = Math.min(signals.recentSignalCount ?? 0, 20) / 20;
  const accepted = Math.min(signals.acceptedRecommendationCount ?? 0, 10) / 10;
  const dismissed = Math.min(signals.dismissedInsightCount ?? 0, 10) / 10;
  const preferenceBoost = (signals.preferredActionTypes?.length ?? 0) > 0 ? 0.1 : 0;
  return Math.min(1, signalCount * 0.4 + accepted * 0.4 + dismissed * 0.1 + preferenceBoost);
}

export function scorePersonalization(
  profile: FinancialProfileInput | null | undefined,
  signals: PersonalizationSignals,
): number {
  const completeness = profileCompleteness(profile);
  const engagement = signalEngagement(signals);
  return Math.round((completeness * 0.6 + engagement * 0.4) * 1000) / 1000;
}
