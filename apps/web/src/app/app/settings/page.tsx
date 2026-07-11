'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Badge, Button, Input, Select, StatCard } from '@/components/ui';
import { usePreferences, useBillingPlan } from '@/hooks/use-finance';
import { api, clearAuthToken, type NotificationSettings } from '@/lib/api';
import { Modal } from '@/components/ui/modal';
import { getDemoMode, setDemoMode } from '@/components/demo-mode-banner';
import { usePlatformAdmin } from '@/hooks/use-platform-admin';
import { adminApi } from '@/lib/admin-api';

const PRIVACY_KEY = 'pf_privacy_blur';

function OrgMembersAndPrivacySections() {
  const qc = useQueryClient();
  const { data: memberships } = useQuery({
    queryKey: ['org-memberships'],
    queryFn: () => api.myOrganizations(),
  });
  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ['org-members'],
    queryFn: () => api.orgMembers(),
  });
  const { data: consents, refetch: refetchConsents } = useQuery({
    queryKey: ['consents'],
    queryFn: () => api.listConsents(),
  });
  const { data: catalog } = useQuery({
    queryKey: ['data-catalog'],
    queryFn: () => api.dataCatalog(),
  });
  const { data: securityEvents } = useQuery({
    queryKey: ['security-events'],
    queryFn: () => api.securityEvents(),
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'viewer'>('viewer');
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  return (
    <>
      {(memberships?.length ?? 0) > 1 && (
        <Card title="Organizations">
          <p className="text-sm text-muted mt-2 mb-3">Switch which organization this session uses.</p>
          <ul className="space-y-2">
            {(memberships ?? []).map((m) => (
              <li key={m.orgId} className="flex items-center justify-between gap-2">
                <span className="text-sm">
                  {m.orgName} <Badge variant={m.isCurrent ? 'primary' : 'default'}>{m.role}</Badge>
                </span>
                {!m.isCurrent && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await api.switchOrganization(m.orgId);
                      window.location.reload();
                    }}
                  >
                    Switch
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Members">
        <p className="text-sm text-muted mt-2 mb-3">Invite family or collaborators and manage roles.</p>
        <ul className="space-y-2 mb-4">
          {(members ?? []).map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                {m.email} <Badge variant="default">{m.role}</Badge>
              </span>
              <div className="flex gap-2">
                <select
                  className="rounded-md border border-card-border bg-card px-2 py-1 text-xs"
                  value={m.role}
                  onChange={(e) =>
                    void api
                      .updateOrgMemberRole(m.userId, e.target.value as 'owner' | 'admin' | 'viewer')
                      .then(() => refetchMembers())
                  }
                >
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                  <option value="viewer">viewer</option>
                </select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    void api.removeOrgMember(m.userId).then(() => {
                      void refetchMembers();
                      void qc.invalidateQueries({ queryKey: ['org-members'] });
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 items-end">
          <Input label="Invite email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'admin' | 'viewer')}
            options={[
              { value: 'viewer', label: 'Viewer' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          <Button
            size="sm"
            disabled={inviteBusy || !inviteEmail}
            onClick={async () => {
              setInviteBusy(true);
              setInviteError(null);
              try {
                await api.inviteOrgMember(inviteEmail, inviteRole);
                setInviteEmail('');
                await refetchMembers();
              } catch (err) {
                setInviteError(err instanceof Error ? err.message : 'Invite failed');
              } finally {
                setInviteBusy(false);
              }
            }}
          >
            Invite
          </Button>
        </div>
        {inviteError && <p className="text-xs text-danger mt-2">{inviteError}</p>}
      </Card>

      <Card title="Consent for use">
        <p className="text-sm text-muted mt-2 mb-3">
          Storage stays max-capture. These toggles control secondary uses (AI full context, advisor sharing, marketing).
        </p>
        <ul className="space-y-3">
          {(consents ?? []).map((c) => (
            <li key={c.purpose} className="flex items-center justify-between gap-2 text-sm">
              <span className="capitalize">{c.purpose.replace(/_/g, ' ')}</span>
              <Button
                size="sm"
                variant={c.granted ? 'secondary' : 'primary'}
                onClick={() => void api.updateConsent(c.purpose, !c.granted).then(() => refetchConsents())}
              >
                {c.granted ? 'Revoke' : 'Grant'}
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Your data">
        <p className="text-sm text-muted mt-2 mb-3">What we store and how long we keep it.</p>
        <ul className="space-y-2 text-sm">
          {(catalog ?? []).map((cat) => (
            <li key={cat.key}>
              <span className="font-medium">{cat.label}</span>
              <span className="text-muted"> — {cat.description}. Retained: {cat.retainedUntil}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Security center">
        <p className="text-sm text-muted mt-2 mb-3">Recent sensitive actions for this organization.</p>
        {!securityEvents?.length ? (
          <p className="text-sm text-muted">No security events yet.</p>
        ) : (
          <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
            {securityEvents.slice(0, 20).map((e) => (
              <li key={e.id} className="text-muted">
                {new Date(e.createdAt).toLocaleString()} · {e.action}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  family: 'Family',
  advisor: 'Advisor',
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  free: 'Core tracking with limited AI and bank connections.',
  pro: 'Unlimited AI insights and advanced forecasting.',
  family: 'Shared household access for up to 5 members.',
  advisor: 'White-glove support and advisor collaboration tools.',
};

const TIER_VARIANTS: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  free: 'default',
  pro: 'primary',
  family: 'success',
  advisor: 'warning',
};

const DEFAULT_NOTIF: NotificationSettings = {
  email: true,
  inApp: true,
  weeklyDigest: true,
  sms: false,
};

function readPrivacyBlur(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PRIVACY_KEY) === '1';
  } catch {
    return false;
  }
}

function writePrivacyBlur(enabled: boolean) {
  try {
    if (enabled) localStorage.setItem(PRIVACY_KEY, '1');
    else localStorage.removeItem(PRIVACY_KEY);
    document.documentElement.classList.toggle('pf-privacy-blur', enabled);
    window.dispatchEvent(new Event('pf:privacy-blur-change'));
  } catch {
    /* ignore */
  }
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { isPlatformAdmin } = usePlatformAdmin();
  const queryClient = useQueryClient();
  const { data: prefs, refetch } = usePreferences();
  const { data: billing, isLoading: billingLoading, refetch: refetchBilling } = useBillingPlan();
  const [planBusy, setPlanBusy] = useState(false);
  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.auditLogs(),
  });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [demoMode, setDemoModeState] = useState(false);
  const [privacyBlur, setPrivacyBlurState] = useState(false);

  useEffect(() => {
    setDemoModeState(getDemoMode());
    setPrivacyBlurState(readPrivacyBlur());
  }, []);

  const notif = { ...DEFAULT_NOTIF, ...prefs?.notificationSettingsJson };

  const savePrefs = async (updates: Record<string, unknown>) => {
    setSaving(true);
    try {
      await api.updatePreferences(updates);
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  const saveNotif = async (key: keyof NotificationSettings, value: boolean) => {
    await savePrefs({
      notificationSettingsJson: { ...notif, [key]: value },
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `personal-finance-export-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await api.deleteAccount(false);
      if (result.pendingDeletion) {
        setDeleteOpen(false);
        setDeleteError(null);
        alert(
          `Deletion scheduled for ${result.deletionScheduledAt ? new Date(result.deletionScheduledAt).toLocaleString() : 'soon'}. You can cancel from Settings before then.`,
        );
        return;
      }
      clearAuthToken();
      window.location.href = '/';
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const tier = billing?.tier ?? 'free';
  const tierLabel = TIER_LABELS[tier] ?? tier;
  const banksLimit = billing?.limits.banks ?? 0;
  const banksUsed = billing?.usage.banks ?? 0;
  const aiUsed = billing?.usage.aiMessagesThisMonth ?? 0;
  const aiLimit = billing?.aiMessagesLimit;
  const docsLimit = billing?.limits.documents ?? 0;
  const docsUsed = billing?.usage.documents ?? 0;
  const banksPct = banksLimit > 0 && banksLimit < 999 ? Math.min((banksUsed / banksLimit) * 100, 100) : 0;
  const aiPct = aiLimit ? Math.min((aiUsed / aiLimit) * 100, 100) : 0;
  const docsPct = docsLimit > 0 && docsLimit < 999 ? Math.min((docsUsed / docsLimit) * 100, 100) : 0;

  return (
    <div>
      <AppPageHeader title="Settings" description="Profile, preferences, and billing" />
      <div className="space-y-4 max-w-2xl">
        <Card title="Account">
          <div className="mt-2 space-y-3">
            <p className="text-sm">
              Signed in as <span className="font-medium">{user?.email ?? 'Loading…'}</span>
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                clearAuthToken();
                await signOut({ returnTo: `${window.location.origin}/login` });
              }}
            >
              Sign out
            </Button>
          </div>
        </Card>

        {isPlatformAdmin && (
          <Card title="Platform testing">
            <p className="text-sm text-muted mt-2 mb-3">
              Switch this org&apos;s plan tier to preview limits and UX. Open Control Plane to view as any customer org.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['free', 'pro', 'family', 'advisor'] as const).map((tierOption) => (
                <Button
                  key={tierOption}
                  size="sm"
                  variant={billing?.tier === tierOption ? 'primary' : 'secondary'}
                  disabled={planBusy || !billing?.orgId}
                  onClick={async () => {
                    if (!billing?.orgId) return;
                    setPlanBusy(true);
                    try {
                      await adminApi.updatePlan(
                        billing.orgId,
                        tierOption,
                        `UX plan preview → ${tierOption}`,
                      );
                      await refetchBilling();
                      await queryClient.invalidateQueries({ queryKey: ['billing-plan'] });
                    } finally {
                      setPlanBusy(false);
                    }
                  }}
                >
                  {tierOption}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted mb-3">
              Current: <strong>{billing?.tier ?? '…'}</strong>
              {billing?.orgId ? ` · org ${billing.orgId.slice(0, 8)}…` : ''}
            </p>
            <Link href="/app/admin" className="text-sm text-primary hover:underline">
              Open Control Plane →
            </Link>
          </Card>
        )}

        <Card title="Preferences">
          <div className="space-y-4 mt-2">
            <Select
              label="Currency"
              value={prefs?.currency ?? 'USD'}
              onChange={(e) => savePrefs({ currency: e.target.value })}
              disabled={saving}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
            />
            <Input
              label="Timezone"
              value={prefs?.timezone ?? 'America/New_York'}
              onChange={(e) => savePrefs({ timezone: e.target.value })}
              disabled={saving}
            />
          </div>
        </Card>

        <Card title="Display & demo">
          <p className="text-sm text-muted mt-2 mb-4">
            Local-only toggles for demos and screen sharing. Stored in this browser.
          </p>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 accent-primary"
                checked={demoMode}
                onChange={(e) => {
                  const on = e.target.checked;
                  setDemoMode(on);
                  setDemoModeState(on);
                }}
              />
              <span>
                <span className="text-sm font-medium block">Demo mode</span>
                <span className="text-xs text-muted">
                  Show a “Demo data” banner across the app (`pf_demo_mode`)
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 accent-primary"
                checked={privacyBlur}
                onChange={(e) => {
                  const on = e.target.checked;
                  writePrivacyBlur(on);
                  setPrivacyBlurState(on);
                }}
              />
              <span>
                <span className="text-sm font-medium block">Privacy blur</span>
                <span className="text-xs text-muted">
                  Blur sensitive amounts while screen sharing (`pf_privacy_blur`)
                </span>
              </span>
            </label>
          </div>
        </Card>

        <Card title="Notifications">
          <p className="text-sm text-muted mt-2 mb-4">Choose how you receive alerts and digests.</p>
          <div className="space-y-3">
            {(
              [
                ['email', 'Email notifications', 'Transaction alerts and account updates'],
                ['inApp', 'In-app notifications', 'Show alerts in your inbox'],
                ['weeklyDigest', 'Weekly digest', 'Monday summary of net worth and insights'],
                ['sms', 'SMS notifications', 'Text messages for urgent alerts'],
              ] as const
            ).map(([key, label, description]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  checked={notif[key] ?? false}
                  onChange={(e) => saveNotif(key, e.target.checked)}
                  disabled={saving}
                />
                <span>
                  <span className="text-sm font-medium block">{label}</span>
                  <span className="text-xs text-muted">{description}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Connected Accounts">
          <p className="text-sm text-muted mt-2">
            Manage Plaid connections in{' '}
            <Link href="/app/accounts" className="text-primary">
              Accounts
            </Link>
            .
          </p>
        </Card>

        <Card title="Tax Profile">
          <p className="text-sm text-muted mt-2">
            Configure in{' '}
            <Link href="/app/taxes" className="text-primary">
              Tax Center
            </Link>{' '}
            or complete{' '}
            <Link href="/app/onboarding" className="text-primary">
              onboarding
            </Link>
            .
          </p>
        </Card>

        <Card title="Billing">
          {billingLoading ? (
            <PageLoading variant="stats" count={3} className="mt-2" />
          ) : (
            <div className="mt-2 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">{tierLabel}</span>
                    <Badge variant={TIER_VARIANTS[tier] ?? 'default'}>{tierLabel} plan</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {TIER_DESCRIPTIONS[tier] ?? 'Your current subscription tier.'}
                  </p>
                </div>
                {tier === 'free' && (
                  <Link href="/pricing">
                    <Button size="sm">
                      <Sparkles className="h-4 w-4" />
                      Upgrade plan
                    </Button>
                  </Link>
                )}
              </div>

              {billing && (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                      title="Banks connected"
                      value={`${banksUsed}${banksLimit < 999 ? ` / ${banksLimit}` : ''}`}
                      change={
                        banksLimit < 999
                          ? {
                              value: `${Math.round(banksPct)}% of limit used`,
                              trend: banksPct > 80 ? 'down' : 'neutral',
                            }
                          : undefined
                      }
                    />
                    <StatCard
                      title="AI messages this month"
                      value={aiLimit != null ? `${aiUsed} / ${aiLimit}` : String(aiUsed)}
                      change={
                        aiLimit != null
                          ? {
                              value: `${Math.round(aiPct)}% of monthly limit`,
                              trend: aiPct > 80 ? 'down' : 'neutral',
                            }
                          : { value: 'Unlimited on your plan', trend: 'up' }
                      }
                    />
                    <StatCard
                      title="Documents"
                      value={docsLimit < 999 ? `${docsUsed} / ${docsLimit}` : String(docsUsed)}
                      change={
                        docsLimit < 999
                          ? {
                              value: `${Math.round(docsPct)}% of limit used`,
                              trend: docsPct > 80 ? 'down' : 'neutral',
                            }
                          : { value: 'Unlimited on your plan', trend: 'up' }
                      }
                    />
                  </div>

                  {banksLimit < 999 && (
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted">
                        <span>Bank connections</span>
                        <span>
                          {banksUsed} / {banksLimit}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card-border">
                        <div
                          className={`h-full rounded-full ${banksPct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${banksPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {aiLimit != null && (
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted">
                        <span>AI messages</span>
                        <span>
                          {aiUsed} / {aiLimit}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card-border">
                        <div
                          className={`h-full rounded-full ${aiPct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${aiPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {docsLimit > 0 && docsLimit < 999 && (
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted">
                        <span>Documents</span>
                        <span>
                          {docsUsed} / {docsLimit}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card-border">
                        <div
                          className={`h-full rounded-full ${docsPct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${docsPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {(banksPct > 80 || (aiLimit != null && aiPct > 80) || docsPct > 80) && tier === 'free' && (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-muted">Approaching plan limits — upgrade for more capacity.</p>
                      <Link href="/pricing">
                        <Button size="sm" variant="secondary">
                          <Sparkles className="h-4 w-4" />
                          Upgrade
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {tier !== 'free' && (
                <p className="text-sm text-muted">
                  Manage or change your plan on the{' '}
                  <Link href="/pricing" className="text-primary hover:underline">
                    pricing page
                  </Link>
                  .
                </p>
              )}
            </div>
          )}
        </Card>

        <OrgMembersAndPrivacySections />

        <Card title="Privacy & Compliance">
          <p className="text-sm text-muted mt-2 mb-4">
            Review audit activity, export your data (GDPR), or schedule account deletion.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Audit log</h3>
              {auditLoading ? (
                <PageLoading variant="table" count={4} />
              ) : !auditLogs?.length ? (
                <p className="text-sm text-muted">No audit events recorded yet.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-card-border">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-card-border">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-muted">Time</th>
                        <th className="text-left px-3 py-2 font-medium text-muted">Action</th>
                        <th className="text-left px-3 py-2 font-medium text-muted">Entity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="border-b border-card-border/50 last:border-0">
                          <td className="px-3 py-2 text-muted whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-3 py-2">{log.action}</td>
                          <td className="px-3 py-2 text-muted">
                            {log.entityType ?? '—'}
                            {log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Data export</h3>
              <p className="text-sm text-muted mb-3">
                Download a JSON copy of your organization data, including accounts, transactions, and preferences.
              </p>
              <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting}>
                {exporting ? 'Preparing export…' : 'Download my data'}
              </Button>
            </div>

            <div className="pt-2 border-t border-card-border">
              <h3 className="text-sm font-medium mb-2 text-danger">Delete account</h3>
              <p className="text-sm text-muted mb-3">
                Schedules deletion with a grace period. Connected Plaid items are removed when deletion executes.
                Cancel anytime before the scheduled date.
              </p>
              <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                Schedule account deletion
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="ml-2"
                onClick={() => void api.cancelAccountDeletion().then(() => alert('Deletion cancelled'))}
              >
                Cancel pending deletion
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Delete account">
        <p className="text-sm text-muted mb-4">
          Type <strong className="text-foreground">DELETE</strong> to confirm permanent deletion of your account and
          all data.
        </p>
        <Input
          className="mb-4"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
          disabled={deleting}
        />
        {deleteError && <p className="text-sm text-danger mb-4">{deleteError}</p>}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirm !== 'DELETE'}
          >
            {deleting ? 'Deleting…' : 'Permanently delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
