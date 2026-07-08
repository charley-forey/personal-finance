'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api, type Transaction } from '@/lib/api';
export default function Page() {
  return <DataPage title="Expenses" description="Spending by category and merchant" load={() => api.transactions(200)} render={(d) => <JsonTable data={(d as Transaction[]).filter((t) => parseFloat(t.amount) > 0)} />} />;
}
