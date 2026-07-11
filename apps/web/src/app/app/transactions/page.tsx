'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, Tag, Undo2 } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageError } from '@/components/page-states';
import { Button, DataTable, EmptyState, Input, Select, Skeleton } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import { useCategories, useTransactionsSearch } from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { api, type Transaction } from '@/lib/api';
import clsx from 'clsx';

type SavedView = 'all' | 'uncategorized' | 'this_month' | 'large';

const SAVED_VIEWS: { id: SavedView; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'uncategorized', label: 'Uncategorized' },
  { id: 'this_month', label: 'This month' },
  { id: 'large', label: 'Large' },
];

const LARGE_TXN_THRESHOLD = 500;

function exportTransactionsCsv(txns: Transaction[]) {
  const headers = ['Date', 'Name', 'Merchant', 'Amount', 'Category', 'Pending'];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = txns.map((t) => [
    t.date,
    t.name,
    t.merchantName ?? '',
    t.amount,
    t.plaidCategoryPrimary ?? '',
    t.pending ? 'Yes' : 'No',
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface UndoSnapshot {
  updates: Array<{ id: string; categoryId?: string }>;
}

export default function TransactionsPage() {
  const formatCurrency = useFormatCurrency();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCategoryId, setBulkCategoryId] = useState('');
  const [applying, setApplying] = useState(false);
  const [undo, setUndo] = useState<UndoSnapshot | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [mobileCategoryFor, setMobileCategoryFor] = useState<string | null>(null);
  const [savedView, setSavedView] = useState<SavedView>('all');

  const { data: categories } = useCategories();
  const { data: txns, isLoading, isFetching, error, refetch } = useTransactionsSearch(200, debouncedSearch);

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const exportable = useMemo(() => {
    const list = txns ?? [];
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    switch (savedView) {
      case 'uncategorized':
        return list.filter((t) => !t.categoryId && !t.plaidCategoryPrimary);
      case 'this_month':
        return list.filter((t) => t.date.startsWith(monthPrefix));
      case 'large':
        return list.filter((t) => Math.abs(parseFloat(t.amount) || 0) >= LARGE_TXN_THRESHOLD);
      default:
        return list;
    }
  }, [txns, savedView]);
  const allSelected = exportable.length > 0 && exportable.every((t) => selected.has(t.id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(exportable.map((t) => t.id)));
  };

  const applyBulk = async () => {
    if (!bulkCategoryId || selected.size === 0) return;
    const ids = [...selected];
    const snapshot: UndoSnapshot = {
      updates: ids.map((id) => {
        const txn = exportable.find((t) => t.id === id);
        return { id, categoryId: txn?.categoryId };
      }),
    };
    setApplying(true);
    try {
      await Promise.all(ids.map((id) => api.updateTransaction(id, { categoryId: bulkCategoryId })));
      setUndo(snapshot);
      setSelected(new Set());
      setBulkCategoryId('');
      await refetch();
    } finally {
      setApplying(false);
    }
  };

  const applyOne = async (id: string, categoryId: string) => {
    const txn = exportable.find((t) => t.id === id);
    setApplying(true);
    try {
      await api.updateTransaction(id, { categoryId });
      setUndo({ updates: [{ id, categoryId: txn?.categoryId }] });
      setMobileCategoryFor(null);
      await refetch();
    } finally {
      setApplying(false);
    }
  };

  const undoLast = async () => {
    if (!undo) return;
    setUndoing(true);
    try {
      await Promise.all(
        undo.updates.map((u) =>
          api.updateTransaction(u.id, { categoryId: u.categoryId ?? undefined }),
        ),
      );
      setUndo(null);
      await refetch();
    } finally {
      setUndoing(false);
    }
  };

  const columns: DataTableColumn<Transaction>[] = useMemo(
    () => [
      {
        key: 'select',
        header: '',
        className: 'w-10',
        headerClassName: 'w-10',
        render: (t) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={selected.has(t.id)}
            onChange={() => toggleOne(t.id)}
            aria-label={`Select ${t.merchantName ?? t.name}`}
          />
        ),
      },
      {
        key: 'date',
        header: 'Date',
        className: 'text-muted whitespace-nowrap',
        render: (t) => (
          <>
            {t.date}
            {t.pending && <span className="ml-2 text-xs text-amber-400">Pending</span>}
          </>
        ),
      },
      {
        key: 'name',
        header: 'Description',
        render: (t) => (
          <div>
            <p className="font-medium">{t.merchantName ?? t.name}</p>
            {t.merchantName && t.name !== t.merchantName && (
              <p className="text-xs text-muted">{t.name}</p>
            )}
            {/* Mobile row action */}
            <div className="mt-2 sm:hidden">
              {mobileCategoryFor === t.id ? (
                <Select
                  className="min-w-[140px]"
                  placeholder="Category…"
                  options={categoryOptions}
                  value=""
                  disabled={applying}
                  onChange={(e) => {
                    if (e.target.value) void applyOne(t.id, e.target.value);
                  }}
                />
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setMobileCategoryFor(t.id)}
                  disabled={applying}
                >
                  Categorize
                </Button>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'plaidCategoryPrimary',
        header: 'Category',
        className: 'text-muted capitalize hidden sm:table-cell',
        headerClassName: 'hidden sm:table-cell',
        render: (t) => t.plaidCategoryPrimary?.replace(/_/g, ' ') ?? '—',
      },
      {
        key: 'amount',
        header: 'Amount',
        className: 'text-right tabular-nums font-medium',
        headerClassName: 'text-right',
        render: (t) => {
          const amt = parseFloat(t.amount);
          return (
            <span className={amt < 0 ? 'text-emerald-400' : 'text-red-400'}>
              {amt < 0 ? '+' : '-'}
              {formatCurrency(Math.abs(amt))}
            </span>
          );
        },
      },
    ],
    [formatCurrency, selected, categoryOptions, mobileCategoryFor, applying],
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSelected(new Set());
  }, [debouncedSearch]);

  return (
    <div>
      <AppPageHeader
        title="Transactions"
        description="Searchable transaction ledger"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportTransactionsCsv(exportable)}
            disabled={exportable.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div
        role="group"
        aria-label="Saved views"
        className="mb-4 flex flex-wrap gap-2"
      >
        {SAVED_VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => setSavedView(view.id)}
            aria-pressed={savedView === view.id}
            className={clsx(
              'min-h-8 rounded-md border px-3 text-xs transition-colors',
              savedView === view.id
                ? 'border-primary/40 bg-primary/10 text-primary font-medium'
                : 'border-card-border text-muted hover:text-foreground hover:bg-white/5',
            )}
          >
            {view.label}
          </button>
        ))}
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <div className="flex gap-3">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Need to fix a category?</p>
            <p className="mt-1 text-muted">
              Select rows below for bulk categorize, or use your{' '}
              <Link href="/app/inbox" className="text-primary hover:underline">
                Transaction Inbox
              </Link>{' '}
              for uncategorized items.
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md flex-1">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isFetching && !isLoading && debouncedSearch && (
            <p className="mt-1 text-xs text-muted">Searching…</p>
          )}
        </div>
        {undo && (
          <Button variant="ghost" size="sm" onClick={undoLast} disabled={undoing}>
            <Undo2 className="h-4 w-4" />
            {undoing ? 'Undoing…' : 'Undo last change'}
          </Button>
        )}
      </div>

      {selected.size > 0 && (
        <Card className="mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <p className="text-sm font-medium sm:mr-auto">{selected.size} selected</p>
            <Select
              label="Apply category"
              className="min-w-[180px]"
              placeholder="Choose category…"
              options={categoryOptions}
              value={bulkCategoryId}
              onChange={(e) => setBulkCategoryId(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={applyBulk} disabled={!bulkCategoryId || applying}>
                {applying ? 'Applying…' : 'Apply to selected'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {error && <PageError message={error.message} />}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : exportable.length === 0 ? (
        <EmptyState
          icon={Tag}
          title={debouncedSearch ? 'No matching transactions' : 'No transactions yet'}
          description={
            debouncedSearch
              ? `Nothing matched "${debouncedSearch}". Try a different search term.`
              : 'Link a bank account to sync your transaction history.'
          }
          action={
            debouncedSearch ? (
              <Button variant="secondary" size="sm" onClick={() => setSearch('')}>
                Clear search
              </Button>
            ) : (
              <Link href="/app/accounts">
                <Button variant="secondary" size="sm">
                  Link accounts
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div>
          <div className="mb-2 flex items-center gap-2 px-1">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={allSelected}
              onChange={toggleAll}
              aria-label="Select all transactions"
            />
            <span className="text-xs text-muted">Select all</span>
          </div>
          <DataTable columns={columns} data={exportable} keyExtractor={(t) => t.id} />
        </div>
      )}
    </div>
  );
}
