import { getAuthToken } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}/admin/v1${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Cannot reach API at ${API_URL}`);
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface PlatformMe {
  isPlatformAdmin: boolean;
  email: string;
  userId: string;
  role: string | null;
  permissions: string[];
  viaBreakGlass: boolean;
  environment: string;
}

export const adminApi = {
  me: () => adminFetch<PlatformMe>('/me'),
  overview: () => adminFetch<Record<string, unknown>>('/metrics/overview'),
  funnel: () => adminFetch<Record<string, unknown>>('/metrics/funnel'),
  aiMetrics: () => adminFetch<{ topOrgs: Array<Record<string, unknown>> }>('/metrics/ai'),
  insights: () => adminFetch<Record<string, unknown>>('/metrics/insights'),
  plaidHealth: () => adminFetch<{ brokenItems: Array<Record<string, unknown>>; pendingWebhooks: number }>('/plaid/health'),
  alerts: () => adminFetch<Array<Record<string, unknown>>>('/alerts'),
  refreshAlerts: () => adminFetch<Record<string, unknown>>('/alerts/refresh', { method: 'POST', body: '{}' }),
  acknowledgeAlert: (id: string) =>
    adminFetch(`/alerts/${id}/acknowledge`, { method: 'POST', body: '{}' }),
  weeklyScorecard: () => adminFetch<Record<string, unknown>>('/scorecard/weekly'),
  search: (q: string) => adminFetch<Record<string, unknown[]>>(`/search?q=${encodeURIComponent(q)}`),
  orgs: (params?: { q?: string; page?: number; status?: string; plan?: string }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.page) sp.set('page', String(params.page));
    if (params?.status) sp.set('status', params.status);
    if (params?.plan) sp.set('plan', params.plan);
    const qs = sp.toString();
    return adminFetch<{ data: Array<Record<string, unknown>>; total: number; page: number; pageSize: number }>(
      `/orgs${qs ? `?${qs}` : ''}`,
    );
  },
  org: (id: string) => adminFetch<Record<string, unknown>>(`/orgs/${id}`),
  orgTimeline: (id: string) => adminFetch<{ events: Array<Record<string, unknown>> }>(`/orgs/${id}/timeline`),
  users: (params?: { q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.page) sp.set('page', String(params.page));
    const qs = sp.toString();
    return adminFetch<{ data: Array<Record<string, unknown>>; total: number }>(`/users${qs ? `?${qs}` : ''}`);
  },
  user: (id: string) => adminFetch<Record<string, unknown>>(`/users/${id}`),
  updatePlan: (id: string, planTier: string, reason: string) =>
    adminFetch(`/orgs/${id}/plan`, { method: 'PATCH', body: JSON.stringify({ planTier, reason }) }),
  updateStatus: (id: string, status: string, reason: string) =>
    adminFetch(`/orgs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }),
  updateMemberRole: (orgId: string, userId: string, role: string, reason: string) =>
    adminFetch(`/orgs/${orgId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ role, reason }) }),
  flags: () => adminFetch<Array<Record<string, unknown>>>('/feature-flags'),
  upsertFlag: (body: { key: string; enabled: boolean; orgOverrides?: Record<string, boolean>; reason: string }) =>
    adminFetch('/feature-flags', { method: 'POST', body: JSON.stringify(body) }),
  subscriptions: (status?: string) =>
    adminFetch<Record<string, unknown>>(`/billing/subscriptions${status ? `?status=${status}` : ''}`),
  outliers: () => adminFetch<{ outliers: Array<Record<string, unknown>> }>('/billing/outliers'),
  compGrant: (orgId: string, planTier: string, reason: string, expiresAt?: string) =>
    adminFetch(`/orgs/${orgId}/comp-grants`, {
      method: 'POST',
      body: JSON.stringify({ planTier, reason, expiresAt }),
    }),
  entitlements: (orgId: string, body: Record<string, unknown>) =>
    adminFetch(`/orgs/${orgId}/entitlements`, { method: 'POST', body: JSON.stringify(body) }),
  queues: () => adminFetch<Record<string, unknown>>('/ops/queues'),
  killSwitches: () => adminFetch<Array<Record<string, unknown>>>('/ops/kill-switches'),
  deepHealth: () => adminFetch<Record<string, unknown>>('/ops/health'),
  forceSync: (itemId: string) =>
    adminFetch(`/ops/plaid/${itemId}/force-sync`, { method: 'POST', body: '{}' }),
  incident: (enable: boolean, reason: string) =>
    adminFetch('/ops/incident', { method: 'POST', body: JSON.stringify({ enable, reason }) }),
  redrive: (queue: string, jobId: string) =>
    adminFetch(`/ops/queues/${queue}/jobs/${jobId}/redrive`, { method: 'POST', body: '{}' }),
  adminAudit: (q?: string) => adminFetch<{ results: Array<Record<string, unknown>> }>(`/audit/admin${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  tenantAudit: (q?: string) => adminFetch<{ results: Array<Record<string, unknown>> }>(`/audit/tenant${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  dsarList: () => adminFetch<Array<Record<string, unknown>>>('/dsar'),
  createDsar: (body: { orgId: string; userId?: string; requestType: 'export' | 'delete'; reason?: string }) =>
    adminFetch('/dsar', { method: 'POST', body: JSON.stringify(body) }),
  approveDsar: (id: string) => adminFetch(`/dsar/${id}/approve`, { method: 'POST', body: '{}' }),
  executeDsar: (id: string) => adminFetch(`/dsar/${id}/execute`, { method: 'POST', body: '{}' }),
  accessReview: () => adminFetch<Record<string, unknown>>('/trust/access-review'),
  sso: () => adminFetch<Record<string, unknown>>('/trust/sso'),
  evidencePack: () => adminFetch<Record<string, unknown>>('/trust/evidence-pack'),
  playbooks: () => adminFetch<Array<Record<string, unknown>>>('/support/playbooks'),
  cases: (status?: string) =>
    adminFetch<{ data: Array<Record<string, unknown>> }>(`/support/cases${status ? `?status=${status}` : ''}`),
  addNote: (orgId: string, body: string) =>
    adminFetch(`/orgs/${orgId}/notes`, { method: 'POST', body: JSON.stringify({ body }) }),
  createCase: (orgId: string, body: { subject: string; priority?: string; playbookKey?: string }) =>
    adminFetch(`/orgs/${orgId}/cases`, { method: 'POST', body: JSON.stringify(body) }),
  updateCase: (id: string, status: string) =>
    adminFetch(`/support/cases/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  impersonate: (orgId: string, reason: string, stepUpToken = 'confirmed') =>
    adminFetch(`/orgs/${orgId}/impersonate`, {
      method: 'POST',
      body: JSON.stringify({ reason, stepUpToken }),
    }),
  revokeImpersonation: (id: string) =>
    adminFetch(`/impersonation/${id}/revoke`, { method: 'POST', body: '{}' }),
  activeImpersonation: () => adminFetch<{ data: Array<Record<string, unknown>> }>('/impersonation/active'),
  prompts: () => adminFetch<Array<Record<string, unknown>>>('/ai/prompts'),
  activatePrompt: (id: string) => adminFetch(`/ai/prompts/${id}/activate`, { method: 'POST', body: '{}' }),
  evals: () => adminFetch<Array<Record<string, unknown>>>('/ai/evals'),
  copilot: (question: string) =>
    adminFetch<{ answer: string; proposals: Array<Record<string, unknown>>; citations: string[] }>('/ai/copilot', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  firms: () => adminFetch<Record<string, unknown>>('/advisor/firms'),
  apiKeys: () => adminFetch<Record<string, unknown>>('/developer/api-keys'),
  webhooks: () => adminFetch<Record<string, unknown>>('/developer/webhooks'),
  experiments: () => adminFetch<Record<string, unknown>>('/experiments'),
  warehouseExport: () => adminFetch<Record<string, unknown>>('/warehouse/export', { method: 'POST', body: '{}' }),
  listAdmins: () => adminFetch<Array<Record<string, unknown>>>('/admins'),
  upsertAdmin: (email: string, role: string) =>
    adminFetch('/admins', { method: 'POST', body: JSON.stringify({ email, role }) }),
};
