'use client';
import { DataPage } from '@/components/data-page';
import { Card, StatCard } from '@/components/app-shell';
import { api } from '@/lib/api';

export default function FirePage() {
  return (
    <DataPage title="FIRE Calculator" description="Financial Independence / Retire Early" load={() => api.fire()} render={(d) => {
      const f = d as { fireNumber: number; yearsToFI: number; progress: number };
      return (
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="FIRE Number" value={`$${(f.fireNumber / 1000).toFixed(0)}k`} />
          <StatCard label="Years to FI" value={f.yearsToFI.toFixed(1)} />
          <StatCard label="Progress" value={`${f.progress.toFixed(1)}%`} />
        </div>
      );
    }} />
  );
}
