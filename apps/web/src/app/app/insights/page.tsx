'use client';

import { useState } from 'react';
import { Lightbulb, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { AppPageHeader, Card, Badge } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, EmptyState } from '@/components/ui';
import { useInsights, useGenerateInsight } from '@/hooks/use-finance';
import { api } from '@/lib/api';

function isSampleInsight(insight: { title?: string; body?: string; insightType?: string }): boolean {
  const blob = `${insight.title ?? ''} ${insight.body ?? ''} ${insight.insightType ?? ''}`.toLowerCase();
  return blob.includes('welcome') || blob.includes('sample') || blob.includes('demo');
}

export default function InsightsPage() {
  const { data: insights, isLoading, error, refetch } = useInsights();
  const generate = useGenerateInsight();
  const [feedbackBusy, setFeedbackBusy] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const submitFeedback = async (
    id: string,
    data: { helpful?: boolean; dismissed?: boolean },
  ) => {
    setFeedbackBusy(id);
    try {
      await api.insightFeedback(id, data);
      if (data.dismissed) {
        setDismissed((prev) => new Set(prev).add(id));
      }
      await refetch();
    } finally {
      setFeedbackBusy(null);
    }
  };

  const visible = (insights ?? []).filter((i) => !dismissed.has(i.id));

  return (
    <div>
      <AppPageHeader
        title="Insights"
        description="AI-generated financial insights"
        actions={
          <Button
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            size="sm"
          >
            {generate.isPending ? 'Generating…' : 'Generate Insight'}
          </Button>
        }
      />

      {error && <PageError message={error.message} />}
      {isLoading && <PageLoading variant="list" count={3} className="mb-6" />}

      <div className="space-y-4">
        {visible.map((i) => (
          <Card key={i.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-primary uppercase">{i.insightType}</span>
              {isSampleInsight(i) && <Badge variant="warning">Sample</Badge>}
            </div>
            <p className="font-medium mt-1">{i.title}</p>
            <p className="text-sm text-muted mt-2">{i.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={feedbackBusy === i.id}
                onClick={() => submitFeedback(i.id, { helpful: true })}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={feedbackBusy === i.id}
                onClick={() => submitFeedback(i.id, { helpful: false })}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                Not helpful
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={feedbackBusy === i.id}
                onClick={() => submitFeedback(i.id, { dismissed: true })}
              >
                <X className="h-3.5 w-3.5" />
                Dismiss
              </Button>
            </div>
          </Card>
        ))}

        {!isLoading && visible.length === 0 && (
          <EmptyState
            icon={Lightbulb}
            title="No insights yet"
            description="Link accounts or generate an insight to get personalized recommendations."
            action={
              <Button onClick={() => generate.mutate()} disabled={generate.isPending}>
                {generate.isPending ? 'Generating…' : 'Generate Insight'}
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
