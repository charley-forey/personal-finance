'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AppPageHeader, Card, Button, Input } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, EmptyState } from '@/components/ui';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { useAccounts, usePlaidItems } from '@/hooks/use-finance';
import { api, type Account, type PlaidItem, formatCurrency } from '@/lib/api';
import { ACCOUNT_PURPOSE_LABELS, purposeFromAccount, type AccountPurpose } from '@pf/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const PURPOSE_ORDER: AccountPurpose[] = ['cash', 'brokerage', 'retirement', 'liability', 'other'];

function itemHealthVariant(item: PlaidItem): 'success' | 'warning' | 'danger' {
  if (item.loginRequired) return 'danger';
  if (item.syncStatus === 'success' && !(item.syncWarnings?.length)) return 'success';
  return 'warning';
}

function itemHealthLabel(item: PlaidItem): string {
  if (item.loginRequired) return 'Re-auth required';
  if (item.errorCode) return item.errorCode;
  if (item.syncWarnings?.length) return 'Needs upgrade';
  return item.syncStatus;
}

function groupByPurpose(accounts: Account[]): Record<string, Account[]> {
  const groups: Record<string, Account[]> = {};
  for (const acct of accounts) {
    const purpose = purposeFromAccount(acct);
    if (!groups[purpose]) groups[purpose] = [];
    groups[purpose].push(acct);
  }
  return groups;
}

function AccountEditForm({
  account,
  onSaved,
}: {
  account: Account;
  onSaved: () => void;
}) {
  const [displayName, setDisplayName] = useState(account.displayName ?? account.name);
  const [purpose, setPurpose] = useState<AccountPurpose>(purposeFromAccount(account));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.updateAccount(account.id, { displayName, purpose });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 space-y-2 border-t border-card-border pt-3">
      <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      <label className="block text-xs text-muted">
        Classification
        <select
          className="mt-1 w-full rounded-md border border-card-border bg-card px-2 py-1.5 text-sm"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as AccountPurpose)}
        >
          {PURPOSE_ORDER.map((p) => (
            <option key={p} value={p}>
              {ACCOUNT_PURPOSE_LABELS[p]}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button size="sm" variant="secondary" disabled={saving} onClick={() => void save()}>
        {saving ? 'Saving…' : 'Save'}
      </Button>
    </div>
  );
}

export default function AccountsPage() {
  const qc = useQueryClient();
  const { data: accounts, isLoading, error } = useAccounts();
  const { data: items, isLoading: itemsLoading } = usePlaidItems();
  const { data: quality } = useQuery({
    queryKey: ['data-quality'],
    queryFn: () => api.dataQuality(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  const activeItems = (items ?? []).filter((i) => i.errorCode !== 'DISCONNECTED');
  const reauthItems = activeItems.filter((i) => i.loginRequired);
  const upgradeItems = activeItems.filter((i) => (i.syncWarnings ?? []).some((w) => w.startsWith('investments:')));
  const grouped = groupByPurpose(accounts ?? []);
  const sortedPurposes = [
    ...PURPOSE_ORDER.filter((p) => grouped[p]?.length),
    ...Object.keys(grouped).filter((k) => !PURPOSE_ORDER.includes(k as AccountPurpose)),
  ];

  async function disconnectItem(itemId: string, wipeHistory: boolean) {
    const label = wipeHistory ? 'Disconnect and wipe all history for this bank?' : 'Disconnect this bank? Transaction history will be kept.';
    if (!window.confirm(label)) return;
    setDisconnectingId(itemId);
    setDisconnectError(null);
    try {
      await api.removePlaidItem(itemId, wipeHistory);
      void qc.invalidateQueries({ queryKey: ['plaid-items'] });
      void qc.invalidateQueries({ queryKey: ['accounts'] });
      void qc.invalidateQueries({ queryKey: ['data-quality'] });
      void qc.invalidateQueries({ queryKey: ['net-worth'] });
    } catch (err) {
      setDisconnectError(err instanceof Error ? err.message : 'Disconnect failed');
    } finally {
      setDisconnectingId(null);
    }
  }

  return (
    <div>
      <AppPageHeader title="Accounts" description="Linked institutions and balances" actions={<PlaidLinkButton />} />

      {quality && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Data quality score</p>
              <p className="text-xs text-muted mt-1">
                {quality.healthyItems}/{quality.totalItems} connections healthy ·{' '}
                {quality.holdingsCoverage.withHoldings}/{quality.holdingsCoverage.investmentAccounts} investment
                accounts with holdings
              </p>
            </div>
            <Badge variant={quality.score >= 80 ? 'success' : quality.score >= 50 ? 'warning' : 'danger'}>
              {quality.score}/100
            </Badge>
          </div>
          {quality.issues.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-muted">
              {quality.issues.slice(0, 5).map((issue) => (
                <li key={issue}>· {issue}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {reauthItems.length > 0 && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-400">Re-authentication required</p>
              <p className="text-sm text-muted mt-1">
                {reauthItems.length === 1
                  ? `${reauthItems[0].institutionName ?? 'A bank connection'} needs to be re-linked.`
                  : `${reauthItems.length} bank connections need to be re-linked.`}
              </p>
              <div className="mt-3">
                <PlaidLinkButton />
              </div>
            </div>
          </div>
        </Card>
      )}

      {upgradeItems.length > 0 && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-400">Upgrade connection for investments</p>
              <p className="text-sm text-muted mt-1">
                Some institutions were linked without the investments product. Re-link to sync Fidelity/brokerage
                holdings and retirement positions.
              </p>
              <div className="mt-3">
                <PlaidLinkButton />
              </div>
            </div>
          </div>
        </Card>
      )}

      {error && <PageError message={error.message} className="mb-4" />}
      {disconnectError && <PageError message={disconnectError} className="mb-4" />}

      {activeItems.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-sm font-medium mb-3">Connected institutions</h2>
          <ul className="space-y-3">
            {activeItems.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{item.institutionName ?? 'Institution'}</p>
                  <p className="text-xs text-muted">
                    <Badge variant={itemHealthVariant(item)}>{itemHealthLabel(item)}</Badge>
                    {item.lastSyncedAt && (
                      <span className="ml-2">Last synced {new Date(item.lastSyncedAt).toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={disconnectingId === item.id}
                    onClick={() => void disconnectItem(item.id, false)}
                  >
                    {disconnectingId === item.id ? 'Disconnecting…' : 'Disconnect'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={disconnectingId === item.id}
                    onClick={() => void disconnectItem(item.id, true)}
                  >
                    Disconnect & wipe
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {isLoading && <PageLoading variant="cards" count={3} className="mb-6" />}

      {sortedPurposes.map((purpose) => (
        <section key={purpose} className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted uppercase tracking-wide">
            {ACCOUNT_PURPOSE_LABELS[purpose as AccountPurpose] ?? purpose}
            <Badge variant="default">{grouped[purpose].length}</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[purpose].map((acct) => {
              const item = items?.find((i) => i.id === acct.itemId);
              return (
                <Card key={acct.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{acct.displayName ?? acct.name}</h3>
                      <p className="text-sm text-muted capitalize">
                        {acct.subtype ?? acct.type}
                        {acct.mask && ` ····${acct.mask}`}
                      </p>
                      {item?.institutionName && (
                        <p className="text-xs text-muted mt-1">{item.institutionName}</p>
                      )}
                      {acct.currentBalance != null && (
                        <p className="mt-2 text-lg tabular-nums font-medium">
                          {formatCurrency(acct.currentBalance)}
                        </p>
                      )}
                    </div>
                    {item && <Badge variant={itemHealthVariant(item)}>{itemHealthLabel(item)}</Badge>}
                    {!item && !itemsLoading && <Badge variant="default">manual</Badge>}
                  </div>
                  {item?.lastSyncedAt && (
                    <p className="text-xs text-muted mt-3">
                      Last synced {new Date(item.lastSyncedAt).toLocaleString()}
                      {acct.balanceSyncJobId && (
                        <span className="block opacity-70">Source: Plaid · job {acct.balanceSyncJobId.slice(0, 8)}</span>
                      )}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-2 text-xs text-muted hover:text-foreground"
                    onClick={() => setEditingId(editingId === acct.id ? null : acct.id)}
                  >
                    {editingId === acct.id ? 'Close' : 'Edit classification'}
                  </button>
                  {editingId === acct.id && (
                    <AccountEditForm
                      account={acct}
                      onSaved={() => {
                        setEditingId(null);
                        void qc.invalidateQueries({ queryKey: ['accounts'] });
                        void qc.invalidateQueries({ queryKey: ['data-quality'] });
                      }}
                    />
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {accounts?.length === 0 && !isLoading && (
        <EmptyState
          title="No accounts linked yet"
          description="Connect a bank to automatically sync balances and transactions."
          action={<PlaidLinkButton />}
        />
      )}
    </div>
  );
}
