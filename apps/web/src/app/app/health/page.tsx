'use client';

import { AppPageHeader, Card, ProvenanceChip } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { StatCard } from '@/components/ui';
import { StatCardWithExplain } from '@/components/stat-card-with-explain';
import { useHealthScore } from '@/hooks/use-finance';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function HealthPage() {
  const { data: h, isLoading, error } = useHealthScore();
  const { data: history } = useQuery({ queryKey: ['health-history'], queryFn: () => api.healthScoreHistory() });

  if (isLoading) {
    return (
      <div>
        <AppPageHeader title="Financial Health" description="Composite score with improvement actions" />
        <PageLoading variant="stats" count={1} className="mb-6" />
        <PageLoading variant="cards" count={4} />
      </div>
    );
  }

  if (error || !h) {
    return (
      <div>
        <AppPageHeader title="Financial Health" description="Composite score with improvement actions" />
        <PageError message={error?.message ?? 'Unable to load health score.'} />
      </div>
    );
  }

  const provenance = (
    <ProvenanceChip
      source="Health model"
      detail="Composite score"
      syncedAt={history?.[0]?.computedAt}
      methodologyHref="/app/library"
    />
  );

  return (
    <div>
      <AppPageHeader title="Financial Health" description="Composite score with improvement actions" />
      <StatCardWithExplain
        title="Overall Score"
        value={`${h.overall}/100`}
        className="max-w-xs"
        explainMetric="health_score"
        provenance={provenance}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {Object.entries(h.subScores).map(([k, v]) => (
          <StatCard
            key={k}
            title={k.replace(/_/g, ' ')}
            value={Math.round(v)}
            provenance={
              <ProvenanceChip source="Health model" detail={k.replace(/_/g, ' ')} />
            }
          />
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
