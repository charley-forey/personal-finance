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
