'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Credit & Debt" description="Liabilities and utilization" load={() => api.liabilities()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
