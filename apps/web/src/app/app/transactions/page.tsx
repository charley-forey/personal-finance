'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/app-shell';
import { Button, DataTable, Input, Skeleton } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import { useTransactionsSearch } from '@/hooks/use-finance';
import { useFormatCurrency } from '@/hooks/use-currency';
import { type Transaction } from '@/lib/api';

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

export default function TransactionsPage() {
  const formatCurrency = useFormatCurrency();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const columns: DataTableColumn<Transaction>[] = useMemo(
    () => [
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
          </div>
        ),
      },
      {
        key: 'plaidCategoryPrimary',
        header: 'Category',
        className: 'text-muted capitalize',
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
    [formatCurrency],
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: txns, isLoading, isFetching } = useTransactionsSearch(200, debouncedSearch);

  const exportable = useMemo(() => txns ?? [], [txns]);

  return (
    <div>
      <PageHeader
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

      <div className="mb-6 max-w-md">
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

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={exportable}
          keyExtractor={(t) => t.id}
          emptyMessage={
            debouncedSearch
              ? `No transactions matching "${debouncedSearch}".`
              : 'No transactions found.'
          }
        />
      )}
    </div>
  );
}
