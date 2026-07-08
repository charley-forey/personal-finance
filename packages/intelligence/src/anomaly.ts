export interface SpendingTransaction {
  id: string;
  amount: number | string;
  date?: string;
  categoryId?: string | null;
  merchantName?: string | null;
  name?: string;
}

export interface SpendingAnomaly {
  transactionId: string;
  amount: number;
  zScore: number;
  categoryId?: string | null;
  merchantName?: string | null;
  name?: string;
  date?: string;
}

export interface AnomalyDetectionOptions {
  zThreshold?: number;
  minSamples?: number;
}

const DEFAULT_Z_THRESHOLD = 2.5;
const DEFAULT_MIN_SAMPLES = 5;

function parseAmount(amount: number | string): number {
  const n = typeof amount === 'number' ? amount : parseFloat(amount);
  return Number.isFinite(n) ? Math.abs(n) : 0;
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values: number[], avg: number): number {
  if (values.length < 2) return 0;
  const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function detectInGroup(
  transactions: SpendingTransaction[],
  zThreshold: number,
  minSamples: number,
): SpendingAnomaly[] {
  if (transactions.length < minSamples) return [];

  const amounts = transactions.map((t) => parseAmount(t.amount));
  const avg = mean(amounts);
  const std = stdDev(amounts, avg);
  if (std === 0) return [];

  const anomalies: SpendingAnomaly[] = [];
  for (const txn of transactions) {
    const amount = parseAmount(txn.amount);
    const zScore = (amount - avg) / std;
    if (zScore >= zThreshold) {
      anomalies.push({
        transactionId: txn.id,
        amount,
        zScore,
        categoryId: txn.categoryId,
        merchantName: txn.merchantName,
        name: txn.name,
        date: txn.date,
      });
    }
  }

  return anomalies.sort((a, b) => b.zScore - a.zScore);
}

export function detectSpendingAnomalies(
  transactions: SpendingTransaction[],
  options?: AnomalyDetectionOptions,
): SpendingAnomaly[] {
  const zThreshold = options?.zThreshold ?? DEFAULT_Z_THRESHOLD;
  const minSamples = options?.minSamples ?? DEFAULT_MIN_SAMPLES;

  if (!transactions.length) return [];

  const byCategory = new Map<string, SpendingTransaction[]>();
  for (const txn of transactions) {
    const key = txn.categoryId ?? '__all__';
    const group = byCategory.get(key) ?? [];
    group.push(txn);
    byCategory.set(key, group);
  }

  const anomalies: SpendingAnomaly[] = [];
  for (const group of byCategory.values()) {
    anomalies.push(...detectInGroup(group, zThreshold, minSamples));
  }

  const seen = new Set<string>();
  return anomalies.filter((a) => {
    if (seen.has(a.transactionId)) return false;
    seen.add(a.transactionId);
    return true;
  });
}
