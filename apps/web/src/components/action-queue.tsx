'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { trackWva } from '@/lib/analytics';
import { useToast } from '@/components/toast-undo';

export function ActionQueue() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.recommendations(),
  });

  const complete = useMutation({
    mutationFn: async ({ id, outcome }: { id: string; outcome: string }) => {
      await api.recommendationOutcome(id, outcome);
      await trackWva(outcome === 'dismissed' ? 'action_dismiss' : 'action_complete', {
        entityType: 'recommendation',
        entityId: id,
        outcome,
      });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['recommendations'] });
      const wasDismiss = variables.outcome === 'dismissed';
      toast.show({
        message: wasDismiss ? 'Action dismissed' : 'Action marked done',
        undo: () => {
          void api
            .recommendationOutcome(variables.id, 'pending')
            .catch(() => undefined)
            .finally(() => {
              void qc.invalidateQueries({ queryKey: ['recommendations'] });
              void api.generateRecommendations().then(() =>
                qc.invalidateQueries({ queryKey: ['recommendations'] }),
              );
            });
        },
      });
    },
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (error) return null;

  const items = data ?? [];
  if (items.length === 0) {
    return (
      <EmptyState
        title="No actions queued"
        description="Generate recommendations from your latest insights."
        action={
          <Button
            size="sm"
            onClick={() =>
              api.generateRecommendations().then(() => qc.invalidateQueries({ queryKey: ['recommendations'] }))
            }
          >
            Refresh actions
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-card-border/60 bg-card/50 p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <Badge variant="info">{item.actionType}</Badge>
            </div>
            {item.body ? <p className="text-xs text-muted mt-1 line-clamp-2">{item.body}</p> : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="secondary" onClick={() => complete.mutate({ id: item.id, outcome: 'completed' })}>
              Done
            </Button>
            <Button size="sm" variant="ghost" onClick={() => complete.mutate({ id: item.id, outcome: 'dismissed' })}>
              Dismiss
            </Button>
          </div>
        </div>
      ))}
      <Link href="/app/insights" className="text-xs text-primary hover:underline">
        View all insights →
      </Link>
    </div>
  );
}
