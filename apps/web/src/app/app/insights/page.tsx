'use client';

import { PageHeader, Card } from '@/components/app-shell';
import { useInsights, useGenerateInsight } from '@/hooks/use-finance';

export default function InsightsPage() {
  const { data: insights, isLoading } = useInsights();
  const generate = useGenerateInsight();

  return (
    <div>
      <PageHeader
        title="Insights"
        description="AI-generated financial insights"
        actions={
          <button
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            className="px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm disabled:opacity-50"
          >
            {generate.isPending ? 'Generating...' : 'Generate Insight'}
          </button>
        }
      />

      {isLoading && <p className="text-muted">Loading insights...</p>}

      <div className="space-y-4">
        {(insights ?? []).map((i) => (
          <Card key={i.id}>
            <span className="text-xs text-primary uppercase">{i.insightType}</span>
            <p className="font-medium mt-1">{i.title}</p>
            <p className="text-sm text-muted mt-2">{i.body}</p>
          </Card>
        ))}
        {insights?.length === 0 && !isLoading && (
          <Card><p className="text-muted text-sm">No insights yet. Link accounts or generate one.</p></Card>
        )}
      </div>
    </div>
  );
}
