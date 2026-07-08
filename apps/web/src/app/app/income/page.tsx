'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api, type Transaction } from '@/lib/api';
export default function Page() {
  return <DataPage title="Income" description="Income streams and YTD trends" load={() => api.transactions(200)} render={(d) => <JsonTable data={(d as Transaction[]).filter((t) => parseFloat(t.amount) < 0)} />} />;
}
