export type MemberRole = 'owner' | 'admin' | 'viewer';
export type PlanTier = 'free' | 'pro' | 'family' | 'advisor';

export interface AuthContext {
  userId: string;
  workosUserId: string;
  email: string;
  orgId: string;
  role: MemberRole;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** Static FX rates: foreign currency units per 1 USD */
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  JPY: 149.5,
  AUD: 1.53,
  CHF: 0.88,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const fromRate = EXCHANGE_RATES[from] ?? 1;
  const toRate = EXCHANGE_RATES[to] ?? 1;
  const usd = amount / fromRate;
  return usd * toRate;
}

export function parseDecimal(value: string | null | undefined): number {
  if (!value) return 0;
  return parseFloat(value);
}

export const PLAID_PRODUCTS = ['transactions', 'investments', 'liabilities'] as const;

export const DEFAULT_PNL_ROWS = [
  'Salary',
  'Other Income',
  'Total Income',
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Debt Payments',
  'Savings',
  'Total Expenses',
  'Net Income',
];

export const DEFAULT_PNL_COLUMNS = ['Budget', 'Actual', 'Variance', 'YTD'];
