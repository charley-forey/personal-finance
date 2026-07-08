'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Goals" description="Track financial goals" load={() => api.goals()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
