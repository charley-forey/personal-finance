'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Manual Assets" description="Real estate, crypto, vehicles" load={() => api.manualAssets()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
