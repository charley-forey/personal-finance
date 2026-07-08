'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Investments" description="Holdings and allocation" load={() => api.holdings()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
