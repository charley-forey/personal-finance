'use client';
import { DataPage } from '@/components/data-page';
import { Card, StatCard } from '@/components/app-shell';
import { api } from '@/lib/api';

export default function HealthPage() {
  return (
    <DataPage title="Financial Health" description="Composite score with improvement actions" load={() => api.healthScore()} render={(d) => {
      const h = d as { overall: number; subScores: Record<string, number>; actions: Array<{ action: string; impact: number }> };
      return (
        <div>
          <StatCard label="Overall Score" value={`${h.overall}/100`} />
          <div className="grid grid-cols-4 gap-4 mt-6">
            {Object.entries(h.subScores).map(([k, v]) => (
              <Card key={k}><p className="text-xs text-muted capitalize">{k}</p><p className="text-xl font-bold">{Math.round(v)}</p></Card>
            ))}
          </div>
          <Card title="Improvement Actions" className="mt-6">
            <ul className="space-y-2">{h.actions.map((a, i) => <li key={i} className="text-sm">• {a.action} (+{a.impact} pts potential)</li>)}</ul>
          </Card>
        </div>
      );
    }} />
  );
}
