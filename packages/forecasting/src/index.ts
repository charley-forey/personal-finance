/** Cash flow forecast — Wave 3 B07 */
export interface ForecastPoint {
  date: string;
  amount: number;
  lower?: number;
  upper?: number;
}

export interface SeasonalityResult {
  detected: boolean;
  periodDays: number;
  strength: number;
  seasonalIndices: number[];
  pattern: 'weekly' | 'monthly' | 'none';
}

export interface MonteCarloSimulationInput {
  currentBalance: number;
  dailyMean: number;
  dailyStd: number;
  days: number;
  simulations?: number;
  confidenceLevel?: number;
}

export interface MonteCarloSimulationOutput {
  simulations: number;
  successRate: number;
  medianEndingBalance: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  paths: {
    p10: number[];
    p50: number[];
    p90: number[];
  };
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function randomNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

export function simpleMovingAverage(series: number[], window = 7): number {
  if (series.length === 0) return 0;
  const slice = series.slice(-window);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export function detectSeasonality(series: number[], maxPeriod = 30): SeasonalityResult {
  if (series.length < maxPeriod * 2) {
    return { detected: false, periodDays: 0, strength: 0, seasonalIndices: [], pattern: 'none' };
  }

  let bestPeriod = 7;
  let bestStrength = 0;

  for (let period = 7; period <= Math.min(maxPeriod, Math.floor(series.length / 2)); period++) {
    const buckets: number[][] = Array.from({ length: period }, () => []);
    for (let i = 0; i < series.length; i++) {
      buckets[i % period]!.push(series[i]!);
    }

    const bucketMeans = buckets.map((b) => (b.length ? b.reduce((a, v) => a + v, 0) / b.length : 0));
    const overallMean = bucketMeans.reduce((a, b) => a + b, 0) / period;
    if (overallMean === 0) continue;

    const strength =
      bucketMeans.reduce((sum, m) => sum + Math.abs(m - overallMean), 0) / (period * Math.abs(overallMean));

    if (strength > bestStrength) {
      bestStrength = strength;
      bestPeriod = period;
    }
  }

  const detected = bestStrength >= 0.08;
  const seasonalIndices: number[] = [];
  if (detected) {
    const buckets: number[][] = Array.from({ length: bestPeriod }, () => []);
    for (let i = 0; i < series.length; i++) {
      buckets[i % bestPeriod]!.push(series[i]!);
    }
    const bucketMeans = buckets.map((b) => (b.length ? b.reduce((a, v) => a + v, 0) / b.length : 0));
    const overallMean = bucketMeans.reduce((a, b) => a + b, 0) / bestPeriod || 1;
    for (const m of bucketMeans) {
      seasonalIndices.push(m / overallMean);
    }
  }

  const pattern: SeasonalityResult['pattern'] =
    !detected ? 'none' : bestPeriod <= 7 ? 'weekly' : 'monthly';

  return {
    detected,
    periodDays: detected ? bestPeriod : 0,
    strength: bestStrength,
    seasonalIndices,
    pattern,
  };
}

export function monteCarloSimulation(input: MonteCarloSimulationInput): MonteCarloSimulationOutput {
  const simulations = input.simulations ?? 500;
  const endingBalances: number[] = [];
  const dailyPaths: number[][] = Array.from({ length: simulations }, () => []);

  for (let sim = 0; sim < simulations; sim++) {
    let balance = input.currentBalance;
    for (let day = 0; day < input.days; day++) {
      balance += randomNormal(input.dailyMean, input.dailyStd);
      dailyPaths[sim]!.push(balance);
    }
    endingBalances.push(balance);
  }

  endingBalances.sort((a, b) => a - b);
  const percentile = (p: number) => endingBalances[Math.floor(endingBalances.length * p)] ?? 0;

  const pathPercentile = (p: number): number[] => {
    const result: number[] = [];
    for (let day = 0; day < input.days; day++) {
      const values = dailyPaths.map((path) => path[day] ?? 0).sort((a, b) => a - b);
      result.push(values[Math.floor(values.length * p)] ?? 0);
    }
    return result;
  };

  const targetBalance = input.currentBalance;
  const successRate =
    (endingBalances.filter((b) => b >= targetBalance * 0.9).length / simulations) * 100;

  return {
    simulations,
    successRate,
    medianEndingBalance: percentile(0.5),
    percentiles: {
      p10: percentile(0.1),
      p25: percentile(0.25),
      p50: percentile(0.5),
      p75: percentile(0.75),
      p90: percentile(0.9),
    },
    paths: {
      p10: pathPercentile(0.1),
      p50: pathPercentile(0.5),
      p90: pathPercentile(0.9),
    },
  };
}

export interface ProjectCashFlowOptions {
  seasonality?: SeasonalityResult;
  confidenceZ?: number;
}

export function projectCashFlow(
  history: number[],
  days: number,
  options: ProjectCashFlowOptions = {},
): ForecastPoint[] {
  const baseline = simpleMovingAverage(history);
  const dailyStd = stdDev(history.length >= 2 ? history : [baseline]);
  const seasonality = options.seasonality ?? detectSeasonality(history);
  const z = options.confidenceZ ?? 1.96;
  const bandWidth = z * dailyStd;

  const out: ForecastPoint[] = [];
  const start = new Date();

  for (let i = 1; i <= days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);

    let amount = baseline;
    if (seasonality.detected && seasonality.seasonalIndices.length > 0) {
      const idx = (i - 1) % seasonality.seasonalIndices.length;
      amount = baseline * (seasonality.seasonalIndices[idx] ?? 1);
    }

    const uncertainty = bandWidth * Math.sqrt(i);
    out.push({
      date: d.toISOString().slice(0, 10),
      amount: Math.round(amount * 100) / 100,
      lower: Math.round((amount - uncertainty) * 100) / 100,
      upper: Math.round((amount + uncertainty) * 100) / 100,
    });
  }

  return out;
}
