/** Cash flow forecast scaffold — Wave 3 B07 */
export interface ForecastPoint {
  date: string;
  amount: number;
  lower?: number;
  upper?: number;
}

export function simpleMovingAverage(series: number[], window = 7): number {
  if (series.length === 0) return 0;
  const slice = series.slice(-window);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export function projectCashFlow(history: number[], days: number): ForecastPoint[] {
  const baseline = simpleMovingAverage(history);
  const out: ForecastPoint[] = [];
  const start = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    out.push({
      date: d.toISOString().slice(0, 10),
      amount: baseline,
      lower: baseline * 0.85,
      upper: baseline * 1.15,
    });
  }
  return out;
}
