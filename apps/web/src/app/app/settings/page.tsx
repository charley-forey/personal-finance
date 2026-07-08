'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Sparkles } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Badge, Button, StatCard } from '@/components/ui';
import { usePreferences, useBillingPlan } from '@/hooks/use-finance';
import { api, clearAuthToken, type NotificationSettings } from '@/lib/api';
import { Modal } from '@/components/ui/modal';

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

export default function SettingsPage() {
  const { data: prefs, refetch } = usePreferences();
  const { data: billing, isLoading: billingLoading } = useBillingPlan();
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
      await api.deleteAccount();
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
  const banksPct = banksLimit > 0 && banksLimit < 999 ? Math.min((banksUsed / banksLimit) * 100, 100) : 0;
  const aiPct = aiLimit ? Math.min((aiUsed / aiLimit) * 100, 100) : 0;

  return (
    <div>
      <PageHeader title="Settings" description="Profile, preferences, and billing" />
      <div className="space-y-4 max-w-2xl">
        <Card title="Preferences">
          <div className="space-y-4 mt-2">
            <label className="block">
              <span className="text-sm text-muted">Currency</span>
              <select
                className="w-full mt-1 bg-background border border-card-border rounded-lg px-3 py-2"
                value={prefs?.currency ?? 'USD'}
                onChange={(e) => savePrefs({ currency: e.target.value })}
                disabled={saving}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-muted">Timezone</span>
              <input
                className="w-full mt-1 bg-background border border-card-border rounded-lg px-3 py-2"
                value={prefs?.timezone ?? 'America/New_York'}
                onChange={(e) => savePrefs({ timezone: e.target.value })}
                disabled={saving}
              />
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
                  className="mt-1"
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
          <p className="text-sm text-muted mt-2">Manage Plaid connections in <Link href="/app/accounts" className="text-primary">Accounts</Link>.</p>
        </Card>

        <Card title="Tax Profile">
          <p className="text-sm text-muted mt-2">Configure in <Link href="/app/taxes" className="text-primary">Tax Center</Link> or complete <Link href="/app/onboarding" className="text-primary">onboarding</Link>.</p>
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
                  <p className="mt-1 text-sm text-muted">{TIER_DESCRIPTIONS[tier] ?? 'Your current subscription tier.'}</p>
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StatCard
                      title="Banks connected"
                      value={`${banksUsed}${banksLimit < 999 ? ` / ${banksLimit}` : ''}`}
                      change={
                        banksLimit < 999
                          ? { value: `${Math.round(banksPct)}% of limit used`, trend: banksPct > 80 ? 'down' : 'neutral' }
                          : undefined
                      }
                    />
                    <StatCard
                      title="AI messages this month"
                      value={aiLimit != null ? `${aiUsed} / ${aiLimit}` : String(aiUsed)}
                      change={
                        aiLimit != null
                          ? { value: `${Math.round(aiPct)}% of monthly limit`, trend: aiPct > 80 ? 'down' : 'neutral' }
                          : { value: 'Unlimited on your plan', trend: 'up' }
                      }
                    />
                  </div>

                  {banksLimit < 999 && (
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted">
                        <span>Bank connections</span>
                        <span>{banksUsed} / {banksLimit}</span>
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
                        <span>{aiUsed} / {aiLimit}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card-border">
                        <div
                          className={`h-full rounded-full ${aiPct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${aiPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {tier !== 'free' && (
                <p className="text-sm text-muted">
                  Manage or change your plan on the{' '}
                  <Link href="/pricing" className="text-primary hover:underline">pricing page</Link>.
                </p>
              )}
            </div>
          )}
        </Card>

        <Card title="Privacy & Compliance">
          <p className="text-sm text-muted mt-2 mb-4">
            Review audit activity, export your data (GDPR), or permanently delete your account.
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
                Permanently delete your organization and all associated data. Connected Plaid items will be removed.
                This action cannot be undone.
              </p>
              <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                Delete my account
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Delete account">
        <p className="text-sm text-muted mb-4">
          Type <strong className="text-foreground">DELETE</strong> to confirm permanent deletion of your account and all data.
        </p>
        <input
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm mb-4"
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
