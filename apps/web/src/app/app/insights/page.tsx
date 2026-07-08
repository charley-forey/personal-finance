'use client';
import { DataPage } from '@/components/data-page';
import { Card } from '@/components/app-shell';
import { api } from '@/lib/api';

export default function InsightsPage() {
  return (
    <DataPage title="Insights" description="AI-generated financial insights" load={() => api.insights()} render={(d) => (
      <div className="space-y-4">
        {(d as Array<{ id: string; title: string; body: string; insightType: string }>).map((i) => (
          <Card key={i.id}>
            <span className="text-xs text-primary uppercase">{i.insightType}</span>
            <p className="font-medium mt-1">{i.title}</p>
            <p className="text-sm text-muted mt-2">{i.body}</p>
          </Card>
        ))}
      </div>
    )} />
  );
}
