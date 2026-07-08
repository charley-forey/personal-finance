export interface RecalibrateCategoriesResult {
  orgId: string;
  status: 'stub';
  recalibrated: number;
}

export interface ScoreForecastAccuracyResult {
  orgId: string;
  status: 'stub';
  scored: number;
}

export async function recalibrateCategories(orgId: string): Promise<RecalibrateCategoriesResult> {
  return { orgId, status: 'stub', recalibrated: 0 };
}

export async function scoreForecastAccuracy(orgId: string): Promise<ScoreForecastAccuracyResult> {
  return { orgId, status: 'stub', scored: 0 };
}
