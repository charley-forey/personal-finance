export interface CategoryCorrectionInput {
  merchantName?: string | null;
  priorCategoryId?: string | null;
  newCategoryId: string;
}

export interface RecalibrateCategoriesResult {
  orgId: string;
  status: 'completed' | 'empty';
  recalibrated: number;
  rulesSuggested: number;
  merchantCoverage: number;
}

export interface ForecastObservation {
  predicted: number;
  actual: number;
}

export interface ScoreForecastAccuracyResult {
  orgId: string;
  status: 'completed' | 'empty';
  scored: number;
  mapePct: number | null;
  withinGate: boolean | null;
}

const FORECAST_MAPE_GATE_PCT = 15;

/**
 * Recalibrate category confidence from correction history.
 * Groups corrections by merchant and prefers the most frequent target category.
 * Pure/in-memory so workers can call with DB-fetched rows without coupling this package to I/O.
 */
export async function recalibrateCategories(
  orgId: string,
  corrections: CategoryCorrectionInput[] = [],
): Promise<RecalibrateCategoriesResult> {
  if (!corrections.length) {
    return {
      orgId,
      status: 'empty',
      recalibrated: 0,
      rulesSuggested: 0,
      merchantCoverage: 0,
    };
  }

  const byMerchant = new Map<string, Map<string, number>>();
  for (const c of corrections) {
    const merchant = c.merchantName?.trim().toLowerCase();
    if (!merchant || !c.newCategoryId) continue;
    const counts = byMerchant.get(merchant) ?? new Map<string, number>();
    counts.set(c.newCategoryId, (counts.get(c.newCategoryId) ?? 0) + 1);
    byMerchant.set(merchant, counts);
  }

  let recalibrated = 0;
  let rulesSuggested = 0;
  for (const counts of byMerchant.values()) {
    let bestCategory: string | null = null;
    let bestCount = 0;
    for (const [categoryId, count] of counts) {
      if (count > bestCount) {
        bestCategory = categoryId;
        bestCount = count;
      }
    }
    if (bestCategory && bestCount > 0) {
      recalibrated += bestCount;
      rulesSuggested += 1;
    }
  }

  return {
    orgId,
    status: 'completed',
    recalibrated,
    rulesSuggested,
    merchantCoverage: byMerchant.size,
  };
}

/**
 * Score forecast accuracy via mean absolute percentage error (MAPE).
 * Returns whether the org is within the IQG forecast MAPE gate (≤ 15%).
 */
export async function scoreForecastAccuracy(
  orgId: string,
  observations: ForecastObservation[] = [],
): Promise<ScoreForecastAccuracyResult> {
  const usable = observations.filter(
    (o) => Number.isFinite(o.predicted) && Number.isFinite(o.actual) && o.actual !== 0,
  );

  if (!usable.length) {
    return {
      orgId,
      status: 'empty',
      scored: 0,
      mapePct: null,
      withinGate: null,
    };
  }

  const mape =
    usable.reduce((sum, o) => sum + Math.abs((o.predicted - o.actual) / o.actual), 0) /
    usable.length;
  const mapePct = Math.round(mape * 10000) / 100;

  return {
    orgId,
    status: 'completed',
    scored: usable.length,
    mapePct,
    withinGate: mapePct <= FORECAST_MAPE_GATE_PCT,
  };
}
