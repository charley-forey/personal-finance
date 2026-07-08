'use client';

import { AlertTriangle } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { Badge, EmptyState, Skeleton } from '@/components/ui';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { useAccounts, usePlaidItems } from '@/hooks/use-finance';
import type { Account, PlaidItem } from '@/lib/api';

const TYPE_LABELS: Record<string, string> = {
  depository: 'Cash & Checking',
  credit: 'Credit Cards',
  loan: 'Loans',
  investment: 'Investments',
  other: 'Other',
};

const TYPE_ICONS: Record<string, string> = {
  depository: '🏦',
  credit: '💳',
  loan: '🏠',
  investment: '📈',
  other: '💰',
};

function itemHealthVariant(item: PlaidItem): 'success' | 'warning' | 'danger' {
  if (item.loginRequired) return 'danger';
  if (item.syncStatus === 'success') return 'success';
  return 'warning';
}

function itemHealthLabel(item: PlaidItem): string {
  if (item.loginRequired) return 'Re-auth required';
  if (item.errorCode) return item.errorCode;
  return item.syncStatus;
}

function groupAccountsByType(accounts: Account[]): Record<string, Account[]> {
  const groups: Record<string, Account[]> = {};
  for (const acct of accounts) {
    const type = acct.type || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(acct);
  }
  return groups;
}

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const { data: items, isLoading: itemsLoading } = usePlaidItems();

  const reauthItems = (items ?? []).filter((i) => i.loginRequired);
  const grouped = groupAccountsByType(accounts ?? []);
  const typeOrder = ['depository', 'credit', 'loan', 'investment', 'other'];
  const sortedTypes = [
    ...typeOrder.filter((t) => grouped[t]?.length),
    ...Object.keys(grouped).filter((t) => !typeOrder.includes(t)),
  ];

  return (
    <div>
      <PageHeader title="Accounts" description="Linked institutions and balances" actions={<PlaidLinkButton />} />

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
              <ul className="mt-2 space-y-1">
                {reauthItems.map((item) => (
                  <li key={item.id} className="text-sm text-muted">
                    · {item.institutionName ?? 'Unknown institution'}
                    {item.errorCode && <span className="text-amber-400/80"> ({item.errorCode})</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <PlaidLinkButton />
              </div>
            </div>
          </div>
        </Card>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      )}

      {error && (
        <Card className="mb-4">
          <p className="text-red-400 text-sm">{error.message}</p>
        </Card>
      )}

      {sortedTypes.map((type) => (
        <section key={type} className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted uppercase tracking-wide">
            <span>{TYPE_ICONS[type] ?? TYPE_ICONS.other}</span>
            {TYPE_LABELS[type] ?? type}
            <Badge variant="default">{grouped[type].length}</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[type].map((acct) => {
              const item = items?.find((i) => i.id === acct.itemId);
              return (
                <Card key={acct.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{acct.name}</h3>
                      <p className="text-sm text-muted capitalize">
                        {acct.subtype ?? acct.type}
                        {acct.mask && ` ····${acct.mask}`}
                      </p>
                      {item?.institutionName && (
                        <p className="text-xs text-muted mt-1">{item.institutionName}</p>
                      )}
                    </div>
                    {item && (
                      <Badge variant={itemHealthVariant(item)}>{itemHealthLabel(item)}</Badge>
                    )}
                    {!item && !itemsLoading && <Badge variant="default">manual</Badge>}
                  </div>
                  {item?.lastSyncedAt && (
                    <p className="text-xs text-muted mt-3">
                      Last synced {new Date(item.lastSyncedAt).toLocaleString()}
                    </p>
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
