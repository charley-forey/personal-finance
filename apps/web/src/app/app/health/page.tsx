'use client';

import { PageHeader, Card, StatCard } from '@/components/app-shell';
import { useHealthScore } from '@/hooks/use-finance';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function HealthPage() {
  const { data: h, isLoading } = useHealthScore();
  const { data: history } = useQuery({ queryKey: ['health-history'], queryFn: () => api.healthScoreHistory() });

  if (isLoading || !h) return <p className="text-muted">Loading health score...</p>;

  return (
    <div>
      <PageHeader title="Financial Health" description="Composite score with improvement actions" />
      <StatCard label="Overall Score" value={`${h.overall}/100`} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {Object.entries(h.subScores).map(([k, v]) => (
          <Card key={k}><p className="text-xs text-muted capitalize">{k}</p><p className="text-xl font-bold">{Math.round(v)}</p></Card>
        ))}
      </div>
      <Card title="Improvement Actions" className="mt-6">
        <ul className="space-y-2 mt-2">{h.actions.map((a, i) => <li key={i} className="text-sm">• {a.action} (+{a.impact} pts potential)</li>)}</ul>
      </Card>
      {history && history.length > 1 && (
        <Card title="Score History" className="mt-6">
          <div className="space-y-2 mt-2">
            {history.slice(0, 10).map((rec, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted">{new Date(rec.computedAt).toLocaleDateString()}</span>
                <span className="font-bold">{rec.overallScore}/100</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
