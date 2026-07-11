'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader, Card, Badge, Button, Input } from '@/components/ui';
import { PageLoading, PageError } from '@/components/page-states';
import { adminApi } from '@/lib/admin-api';

export default function AdminAiPage() {
  const prompts = useQuery({ queryKey: ['admin-prompts'], queryFn: () => adminApi.prompts() });
  const evals = useQuery({ queryKey: ['admin-evals'], queryFn: () => adminApi.evals() });
  const ai = useQuery({ queryKey: ['admin-ai-metrics'], queryFn: () => adminApi.aiMetrics() });
  const insights = useQuery({ queryKey: ['admin-insights'], queryFn: () => adminApi.insights() });
  const [question, setQuestion] = useState('Why might Plaid sync be failing?');
  const [answer, setAnswer] = useState<Record<string, unknown> | null>(null);

  if (ai.isLoading) return <PageLoading />;
  if (ai.isError) return <PageError message={(ai.error as Error).message} />;

  return (
    <div className="space-y-6">
      <AppPageHeader title="AI Platform Ops" description="Copilot, cost attribution, prompts, and insight quality." />

      <Card className="p-4 space-y-3">
        <h3 className="font-medium">Platform Ops Copilot</h3>
        <div className="flex gap-2">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Button
            onClick={async () => {
              const res = await adminApi.copilot(question);
              setAnswer(res as unknown as Record<string, unknown>);
            }}
          >
            Ask
          </Button>
        </div>
        {answer && (
          <div className="text-sm space-y-2">
            <p>{String(answer.answer)}</p>
            <pre className="text-xs text-muted overflow-auto">{JSON.stringify(answer.proposals, null, 2)}</pre>
            <p className="text-xs text-muted">{String(answer.disclaimer ?? '')}</p>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-2">AI cost by org (30d)</h3>
        <ul className="text-sm space-y-1">
          {(ai.data?.topOrgs ?? []).map((o) => (
            <li key={String(o.orgId)}>
              {String(o.orgName)} — ${String(o.estimatedCostUsd)} · {String(o.tokens)} tokens · {String(o.runs)} runs
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-2">Insight quality</h3>
        <pre className="text-xs text-muted overflow-auto">{JSON.stringify(insights.data, null, 2)}</pre>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 space-y-2">
          <h3 className="font-medium">Prompt versions</h3>
          {(prompts.data ?? []).length === 0 && <p className="text-sm text-muted">No prompt versions yet</p>}
          <ul className="text-sm space-y-2">
            {(prompts.data ?? []).map((p) => (
              <li key={String(p.id)} className="flex justify-between gap-2">
                <span>
                  {String(p.agentType)} v{String(p.version)}{' '}
                  {p.isActive ? <Badge variant="success">active</Badge> : null}
                </span>
                {!p.isActive && (
                  <Button size="sm" variant="ghost" onClick={() => adminApi.activatePrompt(String(p.id)).then(() => prompts.refetch())}>
                    Activate
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Model evaluations</h3>
          <pre className="text-xs text-muted overflow-auto max-h-64">{JSON.stringify(evals.data ?? [], null, 2)}</pre>
        </Card>
      </div>
    </div>
  );
}
