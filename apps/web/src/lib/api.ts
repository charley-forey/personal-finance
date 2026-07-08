const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pf_token', token);
  }
}

export function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pf_token');
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
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start it with: npm run dev:api`,
    );
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => apiFetch<{ status: string }>('/health'),
  linkToken: () => apiFetch<{ linkToken: string }>('/plaid/link/token', { method: 'POST', body: '{}' }),
  exchangeToken: (publicToken: string) =>
    apiFetch<unknown>('/plaid/link/exchange', { method: 'POST', body: JSON.stringify({ publicToken }) }),
  plaidItems: () => apiFetch<PlaidItem[]>('/plaid/items'),
  triggerSync: (itemId: string) =>
    apiFetch<unknown>(`/plaid/items/${itemId}/sync`, { method: 'POST', body: '{}' }),
  accounts: () => apiFetch<Account[]>('/accounts'),
  transactions: (limit = 50, search?: string) =>
    apiFetch<Transaction[]>(`/transactions?limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  updateTransaction: (id: string, data: { categoryId?: string; notes?: string }) =>
    apiFetch<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  netWorth: () => apiFetch<{ current: NetWorth; history: Snapshot[] }>('/net-worth'),
  cashFlow: () => apiFetch<CashFlow>('/cash-flow'),
  pnl: (year: number, month: number) => apiFetch<PnlData>(`/pnl/${year}/${month}`),
  closePnl: (periodId: string) => apiFetch<unknown>(`/pnl/${periodId}/close`, { method: 'POST', body: '{}' }),
  portfolioAllocation: () => apiFetch<PortfolioAllocation>('/investments/allocation'),
  billCalendar: () => apiFetch<BillCalendar>('/calendar/bills'),
  budgets: () => apiFetch<Budget[]>('/budgets'),
  createBudget: (data: { categoryId: string; periodStart: string; periodEnd: string; amount: number }) =>
    apiFetch<Budget>('/budgets', { method: 'POST', body: JSON.stringify(data) }),
  budgetActuals: () => apiFetch<BudgetActual[]>('/budgets/actuals'),
  holdings: () => apiFetch<Holding[]>('/investments/holdings'),
  liabilities: () => apiFetch<Liability[]>('/liabilities'),
  recurring: () => apiFetch<RecurringStream[]>('/recurring'),
  goals: () => apiFetch<Goal[]>('/goals'),
  createGoal: (data: Partial<Goal>) => apiFetch<Goal>('/goals', { method: 'POST', body: JSON.stringify(data) }),
  monteCarlo: (inputs: Record<string, unknown>) =>
    apiFetch<unknown>('/forecasts/monte-carlo', { method: 'POST', body: JSON.stringify(inputs) }),
  cashFlowForecast: () => apiFetch<{ series: unknown[] }>('/forecasts/cash-flow'),
  insights: () => apiFetch<Insight[]>('/insights'),
  generateInsight: () => apiFetch<unknown>('/insights/generate', { method: 'POST', body: '{}' }),
  insightFeedback: (id: string, data: { helpful?: boolean; actedOn?: boolean; dismissed?: boolean; reason?: string }) =>
    apiFetch<unknown>(`/insights/${id}/feedback`, { method: 'POST', body: JSON.stringify(data) }),
  recommendations: () => apiFetch<RecommendationItem[]>('/recommendations'),
  generateRecommendations: () => apiFetch<RecommendationItem[]>('/recommendations/generate', { method: 'POST', body: '{}' }),
  recommendationOutcome: (id: string, outcome: string, notes?: string) =>
    apiFetch<unknown>(`/recommendations/${id}/outcome`, { method: 'POST', body: JSON.stringify({ outcome, notes }) }),
  recordSignal: (data: { signalType: string; entityType?: string; entityId?: string; payload?: Record<string, unknown> }) =>
    apiFetch<unknown>('/signals', { method: 'POST', body: JSON.stringify(data) }),
  healthScore: () => apiFetch<HealthScore>('/health-score'),
  healthScoreHistory: () => apiFetch<HealthScoreRecord[]>('/health-score/history'),
  activity: () => apiFetch<ActivityEvent[]>('/activity'),
  activityFeed: () => apiFetch<ActivityEvent[]>('/activity'),
  agentChat: (agentType: string, message: string, conversationId?: string) =>
    apiFetch<{ response: string; conversationId: string; toolCalls?: unknown[] }>('/agents/chat', {
      method: 'POST',
      body: JSON.stringify({ agentType, message, conversationId }),
    }),
  agentConversations: () => apiFetch<AgentConversation[]>('/agents/conversations'),
  taxEstimate: (year?: number) => apiFetch<TaxEstimate>(`/taxes/estimate${year ? `?year=${year}` : ''}`),
  taxesEstimate: (year?: number) => apiFetch<TaxEstimate>(`/taxes/estimate${year ? `?year=${year}` : ''}`),
  taxProfile: () => apiFetch<TaxProfile | null>('/taxes/profile'),
  updateTaxProfile: (data: Partial<TaxProfile>) =>
    apiFetch<TaxProfile>('/taxes/profile', { method: 'PUT', body: JSON.stringify(data) }),
  debtSimulate: (data: unknown) => apiFetch<unknown>('/debt/simulate', { method: 'POST', body: JSON.stringify(data) }),
  fire: () => apiFetch<FireResult>('/fire'),
  notifications: () => apiFetch<Notification[]>('/notifications'),
  markNotificationRead: (id: string) => apiFetch<unknown>(`/notifications/${id}/read`, { method: 'PATCH', body: '{}' }),
  categories: () => apiFetch<Category[]>('/categories'),
  categoryGroups: () => apiFetch<CategoryGroup[]>('/categories/groups'),
  inbox: () => apiFetch<InboxData>('/inbox'),
  profile: async () => {
    const res = await apiFetch<{ profile: FinancialProfile | null }>('/profile');
    return res.profile;
  },
  updateProfile: async (data: Partial<FinancialProfile>) => {
    const res = await apiFetch<{ profile: FinancialProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.profile;
  },
  preferences: () => apiFetch<UserPreferences>('/preferences'),
  updatePreferences: (data: Partial<UserPreferences>) =>
    apiFetch<UserPreferences>('/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  manualAssets: () => apiFetch<ManualAsset[]>('/assets/manual'),
  createManualAsset: (data: { assetType: string; name: string; currentValue: number }) =>
    apiFetch<ManualAsset>('/assets/manual', { method: 'POST', body: JSON.stringify(data) }),
  updateManualAsset: (id: string, data: { assetType: string; name: string; currentValue: number }) =>
    apiFetch<ManualAsset>(`/assets/manual/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteManualAsset: (id: string) =>
    apiFetch<ManualAsset>(`/assets/manual/${id}`, { method: 'DELETE' }),
  documents: () => apiFetch<Document[]>('/documents'),
  documentUploadUrl: (filename: string, contentType?: string) =>
    apiFetch<{ uploadUrl: string; storageKey: string }>('/documents/upload-url', {
      method: 'POST',
      body: JSON.stringify({ filename, contentType }),
    }),
  createDocument: (data: { filename: string; taxYear: number; documentType?: string; storageKey: string }) =>
    apiFetch<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        documentType: data.documentType ?? 'other',
      }),
    }),
  rules: () => apiFetch<AutomationRule[]>('/rules'),
  createRule: (data: Partial<AutomationRule> & { conditions?: Record<string, unknown>; action?: Record<string, unknown> }) =>
    apiFetch<AutomationRule>('/rules', { method: 'POST', body: JSON.stringify(data) }),
  updateRule: (id: string, data: Partial<AutomationRule> & { conditions?: Record<string, unknown>; action?: Record<string, unknown> }) =>
    apiFetch<AutomationRule>(`/rules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRule: (id: string) => apiFetch<AutomationRule>(`/rules/${id}`, { method: 'DELETE' }),
  createRuleFromText: (description: string) =>
    apiFetch<unknown>('/rules/from-text', { method: 'POST', body: JSON.stringify({ description }) }),
  parseDocument: (id: string, rawText?: string) =>
    apiFetch<Document>(`/documents/${id}/parse`, { method: 'POST', body: JSON.stringify({ rawText }) }),
  lifePlans: () => apiFetch<LifePlan[]>('/life-plans'),
  createLifePlan: (data: Partial<LifePlan>) =>
    apiFetch<LifePlan>('/life-plans', { method: 'POST', body: JSON.stringify(data) }),
  equity: () => apiFetch<EquityGrant[]>('/equity'),
  createEquityGrant: (data: Partial<EquityGrant>) =>
    apiFetch<EquityGrant>('/equity', { method: 'POST', body: JSON.stringify(data) }),
  scenarios: () => apiFetch<Scenario[]>('/scenarios'),
  createScenario: (data: Partial<Scenario> & { inputs?: Record<string, unknown> }) =>
    apiFetch<Scenario>('/scenarios', { method: 'POST', body: JSON.stringify(data) }),
  runScenario: (id: string) =>
    apiFetch<{ scenario: Scenario; result: ScenarioResult }>(`/scenarios/${id}/run`, { method: 'POST', body: '{}' }),
  entities: () => apiFetch<Entity[]>('/entities'),
  tags: () => apiFetch<Tag[]>('/tags'),
  knowledgeSearch: (q: string, domain?: string) =>
    apiFetch<{ results: Array<{ content: string; score: number }> }>(`/knowledge/search?q=${encodeURIComponent(q)}${domain ? `&domain=${domain}` : ''}`),
  billingCheckout: (priceId: string) =>
    apiFetch<{ url: string | null; message?: string }>('/billing/checkout', { method: 'POST', body: JSON.stringify({ priceId }) }),
  billingPlan: () =>
    apiFetch<BillingPlan>('/billing/plan'),
  households: () => apiFetch<unknown[]>('/households'),
  auditLogs: () => apiFetch<AuditLog[]>('/compliance/audit-logs'),
  exportData: () => apiFetch<GdprExport>('/compliance/export'),
  deleteAccount: () => apiFetch<{ deleted: boolean; plaidItemsRemoved: number }>('/compliance/account', { method: 'DELETE' }),
};

export interface AgentConversation {
  id: string;
  agentType: string;
  messagesJson?: Array<{ role: string; content: string }>;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  mask?: string;
  currency: string;
  itemId?: string;
}

export interface PlaidItem {
  id: string;
  institutionName?: string;
  syncStatus: string;
  lastSyncedAt?: string;
  loginRequired: boolean;
  errorCode?: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  merchantName?: string;
  pending: boolean;
  categoryId?: string;
  plaidCategoryPrimary?: string;
}

export interface Category {
  id: string;
  name: string;
  groupId?: string;
  pnlRowKey?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  type: string;
  categories: Category[];
}

export interface InboxData {
  uncategorized: Transaction[];
  anomalies: Transaction[];
}

export interface NetWorth {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  cash?: number;
  investments?: number;
  creditDebt?: number;
}

export interface Snapshot {
  snapshotDate: string;
  netWorth: string;
  totalAssets: string;
  totalLiabilities: string;
  cash?: string;
  investments?: string;
}

export interface CashFlow {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface Budget {
  id: string;
  categoryId?: string;
  periodStart: string;
  periodEnd: string;
  amount: string;
}

export interface BudgetActual {
  budget_actuals: { spent: string; remaining: string };
  budgets: Budget;
}

export interface Goal {
  id: string;
  name: string;
  goalType: string;
  targetAmount?: string;
  currentAmount?: string;
  targetDate?: string;
}

export interface Holding {
  id: string;
  quantity?: string;
  institutionValue?: string;
  costBasis?: string;
  securityName?: string;
  ticker?: string;
  securityType?: string;
}

export interface PortfolioAllocation {
  total: number;
  driftScore: number;
  slices: Array<{ name: string; value: number; percent: number; targetPercent: number; drift: number }>;
  target: { equity: number; fixedIncome: number; cash: number };
}

export interface BillEvent {
  date: string;
  label: string;
  amount: number;
  type: 'recurring' | 'liability';
  sourceId: string;
}

export interface BillCalendar {
  events: BillEvent[];
  totalDue: number;
  days: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  triggerType: string;
  actionType: string;
  triggerConditionsJson?: Record<string, unknown>;
  actionConfigJson?: Record<string, unknown>;
  triggerCount?: number;
}

export interface ScenarioResult {
  name: string;
  endingBalance: number;
  minBalance: number;
  totalNet: number;
  success: boolean;
  series: Array<{ month: number; balance: number; income: number; expenses: number; net: number }>;
}

export interface Liability {
  id: string;
  liabilityType?: string;
  apr?: string;
  minimumPayment?: string;
  nextPaymentDue?: string;
}

export interface RecurringStream {
  id: string;
  description?: string;
  frequency?: string;
  averageAmount?: string;
  isActive: boolean;
  lastDate?: string;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  insightType: string;
  severity: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  body?: string;
  actionType: string;
  priorityScore?: string;
  confidence?: string;
  status: string;
}

export interface HealthScore {
  overall: number;
  subScores: Record<string, number>;
  actions: Array<{ action: string; impact: number }>;
}

export interface HealthScoreRecord {
  overallScore: number;
  computedAt: string;
  subScoresJson?: Record<string, number>;
}

export interface ActivityEvent {
  id: string;
  entityType: string;
  fieldName?: string;
  changeSource: string;
  detectedAt: string;
}

export interface PnlData {
  period: { id: string; year: number; month: number; status?: string };
  cells: Array<{ rowKey: string; columnKey: string; value: string }>;
  structure: { rows: string[]; columns: string[] };
}

export interface TaxEstimate {
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  owedOrRefund: number;
  quarterlyPayment: number;
  safeHarborMet: boolean;
  taxYear?: number;
  quarterlyPayments?: Array<{ quarter: string; dueDate: string; amount: number }>;
  bracketBreakdown: Array<{ bracket: string; income: number; tax: number }>;
}

export interface FireResult {
  fireNumber: number;
  yearsToFI: number;
  progress: number;
  coastFI: number;
}

export interface ManualAsset {
  id: string;
  assetType: string;
  name: string;
  currentValue?: string;
  acquisitionValue?: string;
  acquisitionDate?: string;
  updatedAt?: string;
}

export interface FinancialProfile {
  id?: string;
  lifeStage?: string;
  riskTolerance?: string;
  filingStatus?: string;
  dependents?: number;
  annualIncome?: string;
  stateCode?: string;
  goalsSummary?: string;
}

export interface TaxProfile {
  filingStatus?: string;
  state?: string;
  dependents?: number;
  estimatedAnnualIncome?: string;
  withholdingYtd?: string;
}

export interface UserPreferences {
  currency: string;
  timezone: string;
  notificationSettingsJson?: NotificationSettings;
}

export interface NotificationSettings {
  email?: boolean;
  inApp?: boolean;
  weeklyDigest?: boolean;
  sms?: boolean;
}

export interface BillingPlan {
  tier: string;
  limits: { banks: number; aiChatsPerDay: number; historyDays: number };
  aiMessagesLimit: number | null;
  usage: { banks: number; aiMessagesThisMonth: number };
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt?: string;
}

export interface LifePlan {
  id: string;
  name: string;
  planType: string;
  targetDate?: string;
  status?: string;
}

export interface EquityGrant {
  id: string;
  grantType: string;
  companyName: string;
  ticker?: string;
  totalShares?: string;
  vestedShares?: string;
  strikePrice?: string;
  currentFmv?: string;
}

export interface Scenario {
  id: string;
  name: string;
  scenarioType: string;
  inputsJson?: Record<string, unknown>;
  resultsJson?: ScenarioResult;
}

export interface Entity {
  id: string;
  name: string;
  entityType: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Document {
  id: string;
  filename: string;
  documentType: string;
  taxYear?: number;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadataJson?: Record<string, unknown>;
  createdAt: string;
}

export interface GdprExport {
  exportedAt: string;
  format: string;
  organization: unknown;
  user: unknown;
  accounts: unknown[];
  transactions: unknown[];
  auditLogs: AuditLog[];
}

export function formatCurrency(amount: number | string, currency = 'USD') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num || 0);
}
