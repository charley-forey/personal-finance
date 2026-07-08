'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Budgets" description="Budget vs actual tracking" load={() => api.budgets()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
