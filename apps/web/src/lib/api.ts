const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pf_token', token);
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pf_token');
  }
  return null;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => apiFetch<{ status: string }>('/health'),
  createSession: (data: { workosUserId: string; email: string; name?: string }) =>
    apiFetch<{ user: unknown; token: string }>('/auth/session', { method: 'POST', body: JSON.stringify(data) }),
  linkToken: () => apiFetch<{ linkToken: string }>('/plaid/link/token', { method: 'POST', body: '{}' }),
  exchangeToken: (publicToken: string) =>
    apiFetch<unknown>('/plaid/link/exchange', { method: 'POST', body: JSON.stringify({ publicToken }) }),
  accounts: () => apiFetch<Account[]>('/accounts'),
  transactions: (limit = 50) => apiFetch<Transaction[]>(`/transactions?limit=${limit}`),
  netWorth: () => apiFetch<{ current: NetWorth; history: Snapshot[] }>('/net-worth'),
  cashFlow: () => apiFetch<CashFlow>('/cash-flow'),
  pnl: (year: number, month: number) => apiFetch<PnlData>(`/pnl/${year}/${month}`),
  budgets: () => apiFetch<unknown[]>('/budgets'),
  holdings: () => apiFetch<unknown[]>('/investments/holdings'),
  liabilities: () => apiFetch<unknown[]>('/liabilities'),
  recurring: () => apiFetch<unknown[]>('/recurring'),
  goals: () => apiFetch<Goal[]>('/goals'),
  createGoal: (data: Partial<Goal>) => apiFetch<Goal>('/goals', { method: 'POST', body: JSON.stringify(data) }),
  monteCarlo: (inputs: Record<string, unknown>) =>
    apiFetch<unknown>('/forecasts/monte-carlo', { method: 'POST', body: JSON.stringify(inputs) }),
  cashFlowForecast: () => apiFetch<{ series: unknown[] }>('/forecasts/cash-flow'),
  insights: () => apiFetch<Insight[]>('/insights'),
  generateInsight: () => apiFetch<unknown>('/insights/generate', { method: 'POST', body: '{}' }),
  healthScore: () => apiFetch<HealthScore>('/health-score'),
  agentChat: (agentType: string, message: string) =>
    apiFetch<{ response: string }>('/agents/chat', {
      method: 'POST',
      body: JSON.stringify({ agentType, message }),
    }),
  taxEstimate: () => apiFetch<unknown>('/taxes/estimate'),
  debtSimulate: (data: unknown) => apiFetch<unknown>('/debt/simulate', { method: 'POST', body: JSON.stringify(data) }),
  fire: () => apiFetch<unknown>('/fire'),
  notifications: () => apiFetch<unknown[]>('/notifications'),
  verifications: () => apiFetch<unknown[]>('/verifications'),
  items: () => apiFetch<unknown[]>('/items'),
  manualAssets: () => apiFetch<unknown[]>('/assets/manual'),
  documents: () => apiFetch<unknown[]>('/documents'),
  rules: () => apiFetch<unknown[]>('/rules'),
  lifePlans: () => apiFetch<unknown[]>('/life-plans'),
  equity: () => apiFetch<unknown[]>('/equity'),
  scenarios: () => apiFetch<unknown[]>('/scenarios'),
};

export interface Account {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  mask?: string;
  currency: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  merchantName?: string;
  pending: boolean;
  plaidCategoryPrimary?: string;
}

export interface NetWorth {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface Snapshot {
  snapshotDate: string;
  netWorth: string;
  totalAssets: string;
  totalLiabilities: string;
}

export interface CashFlow {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface Goal {
  id: string;
  name: string;
  goalType: string;
  targetAmount?: string;
  currentAmount?: string;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  insightType: string;
  severity: string;
}

export interface HealthScore {
  overall: number;
  subScores: Record<string, number>;
  actions: Array<{ action: string; impact: number }>;
}

export interface PnlData {
  period: { id: string; year: number; month: number };
  cells: Array<{ rowKey: string; columnKey: string; value: string }>;
  structure: { rows: string[]; columns: string[] };
}

export function formatCurrency(amount: number | string, currency = 'USD') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num || 0);
}
