'use client';
import { DataPage, JsonTable } from '@/components/data-page';
import { api } from '@/lib/api';
export default function Page() {
  return <DataPage title="Notifications" description="Alerts and reminders" load={() => api.notifications()} render={(d) => <JsonTable data={d as unknown[]} />} />;
}
