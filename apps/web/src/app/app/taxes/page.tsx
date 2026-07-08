'use client';
import { DataPage } from '@/components/data-page';
import { Card } from '@/components/app-shell';
import { api, formatCurrency } from '@/lib/api';

export default function TaxesPage() {
  return (
    <DataPage title="Tax Center" description="YTD estimates and quarterly payments" load={() => api.taxEstimate()} render={(d) => {
      const t = d as { totalTax: number; owedOrRefund: number; quarterlyPayment: number; effectiveRate: number };
      return (
        <div className="grid grid-cols-2 gap-4">
          <Card><p className="text-muted text-sm">Estimated Total Tax</p><p className="text-2xl font-bold tabular-nums">{formatCurrency(t.totalTax)}</p></Card>
          <Card><p className="text-muted text-sm">Owed / Refund</p><p className="text-2xl font-bold tabular-nums">{formatCurrency(t.owedOrRefund)}</p></Card>
          <Card><p className="text-muted text-sm">Next Quarterly Payment</p><p className="text-2xl font-bold tabular-nums">{formatCurrency(t.quarterlyPayment)}</p></Card>
          <Card><p className="text-muted text-sm">Effective Rate</p><p className="text-2xl font-bold tabular-nums">{(t.effectiveRate * 100).toFixed(1)}%</p></Card>
        </div>
      );
    }} />
  );
}
