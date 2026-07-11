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

export {
  PLAID_STALE_MS,
  deriveAccountPurpose,
  purposeFromAccount,
  ACCOUNT_PURPOSE_LABELS,
  type AccountPurpose,
} from './account-taxonomy';

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

export type AgentType =
  | 'tax_advisor'
  | 'retirement_planner'
  | 'budget_coach'
  | 'investment_analyst'
  | 'general_cfo'
  | 'debt_optimizer'
  | 'estate_planner'
  | 'insurance_reviewer'
  | 'college_planner'
  | 'subscription_hunter'
  | 'cash_flow_forecaster'
  | 'compliance_copilot'
  | 'household_coordinator';

export interface FinancialProfile {
  lifeStage?: string;
  riskTolerance?: string;
  filingStatus?: string;
  dependents?: number;
  annualIncome?: number;
  stateCode?: string;
  goalsSummary?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  body?: string;
  actionType: string;
  priorityScore?: number;
  confidence?: number;
  status: 'pending' | 'accepted' | 'dismissed' | 'completed';
}

export interface InsightFeedbackInput {
  insightId: string;
  helpful?: boolean;
  actedOn?: boolean;
  dismissed?: boolean;
  reason?: string;
}

export interface UserSignalInput {
  signalType: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
}

export const INTELLIGENCE_QUALITY_GATES = {
  factualAccuracyPct: 98,
  categorizationAccuracyPct: 85,
  forecastMapePct: 15,
  insightAcceptancePct: 30,
  hallucinationRatePct: 1,
  agentLatencyP95Ms: 8000,
  llmCostPerProUserUsd: 0.5,
} as const;

/** Platform Control Plane roles (distinct from org member roles). */
export type PlatformRole =
  | 'platform_owner'
  | 'platform_admin'
  | 'support_agent'
  | 'billing_ops'
  | 'eng_ops'
  | 'security_compliance'
  | 'readonly_analyst';

export type PlatformPermission =
  | 'orgs:read'
  | 'orgs:write'
  | 'users:read'
  | 'billing:read'
  | 'billing:write'
  | 'flags:read'
  | 'flags:write'
  | 'metrics:read'
  | 'queues:manage'
  | 'audit:read'
  | 'dsar:execute'
  | 'support:write'
  | 'impersonate'
  | 'ai:gov'
  | 'admins:manage'
  | 'advisor:read'
  | 'advisor:write';

export const PLATFORM_ROLE_PERMISSIONS: Record<PlatformRole, PlatformPermission[]> = {
  platform_owner: [
    'orgs:read', 'orgs:write', 'users:read', 'billing:read', 'billing:write',
    'flags:read', 'flags:write', 'metrics:read', 'queues:manage', 'audit:read',
    'dsar:execute', 'support:write', 'impersonate', 'ai:gov', 'admins:manage',
    'advisor:read', 'advisor:write',
  ],
  platform_admin: [
    'orgs:read', 'orgs:write', 'users:read', 'billing:read', 'billing:write',
    'flags:read', 'flags:write', 'metrics:read', 'queues:manage', 'audit:read',
    'dsar:execute', 'support:write', 'impersonate', 'ai:gov',
    'advisor:read', 'advisor:write',
  ],
  support_agent: [
    'orgs:read', 'users:read', 'billing:read', 'metrics:read', 'support:write',
    'impersonate', 'flags:read',
  ],
  billing_ops: [
    'orgs:read', 'users:read', 'billing:read', 'billing:write', 'metrics:read',
  ],
  eng_ops: [
    'orgs:read', 'users:read', 'flags:read', 'flags:write', 'metrics:read',
    'queues:manage', 'ai:gov',
  ],
  security_compliance: [
    'orgs:read', 'users:read', 'audit:read', 'dsar:execute', 'metrics:read',
    'admins:manage',
  ],
  readonly_analyst: [
    'orgs:read', 'users:read', 'billing:read', 'metrics:read', 'flags:read',
    'audit:read', 'advisor:read',
  ],
};

export interface PlatformAdminContext {
  isPlatformAdmin: boolean;
  email: string;
  userId: string;
  role: PlatformRole | null;
  permissions: PlatformPermission[];
  viaBreakGlass: boolean;
}

export function permissionsForRole(role: PlatformRole): PlatformPermission[] {
  return PLATFORM_ROLE_PERMISSIONS[role] ?? [];
}

export function hasPlatformPermission(
  ctx: Pick<PlatformAdminContext, 'permissions'>,
  permission: PlatformPermission,
): boolean {
  return ctx.permissions.includes(permission);
}
