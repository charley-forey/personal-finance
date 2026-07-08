'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Documents" description="Tax docs, statements, receipts" load={() => api.documents()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
