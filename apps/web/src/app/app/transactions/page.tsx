'use client';

import { DataPage, JsonTable } from '@/components/data-page';
import { api, formatCurrency } from '@/lib/api';
import { Card } from '@/components/app-shell';

export default function TransactionsPage() {
  return (
    <DataPage
      title="Transactions"
      description="Searchable transaction ledger"
      load={() => api.transactions(100)}
      render={(data) => {
        const txns = data as Array<{ name: string; amount: string; date: string; merchantName?: string; pending: boolean }>;
        return (
          <Card>
            <div className="space-y-2">
              {txns.length === 0 ? (
                <p className="text-muted text-sm">No transactions. Connect a bank account.</p>
              ) : (
                txns.map((t, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-card-border/50">
                    <div>
                      <p className="font-medium">{t.merchantName ?? t.name}</p>
                      <p className="text-xs text-muted">{t.date}{t.pending ? ' · Pending' : ''}</p>
                    </div>
                    <p className={`tabular-nums font-medium ${parseFloat(t.amount) < 0 ? 'text-primary' : ''}`}>
                      {formatCurrency(Math.abs(parseFloat(t.amount)))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        );
      }}
    />
  );
}
