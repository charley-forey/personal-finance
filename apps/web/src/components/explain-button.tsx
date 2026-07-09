'use client';

import { useState } from 'react';
import { useExplainMetric } from '@/hooks/use-finance';
import { Button, Modal, Skeleton } from '@/components/ui';
import { HelpCircle } from 'lucide-react';

interface ExplainButtonProps {
  metric: string;
  label?: string;
  className?: string;
}

export function ExplainButton({ metric, label = 'Why?', className }: ExplainButtonProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useExplainMetric(open ? metric : undefined);

  return (
    <>
      <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
        <HelpCircle className="w-3.5 h-3.5 mr-1" />
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={data?.title ?? 'Explanation'}>
        {isLoading && <Skeleton className="h-24 w-full" />}
        {data && (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{data.definition}</p>
            <div>
              <p className="font-medium text-xs uppercase text-muted-foreground">Your value</p>
              <p className="text-lg font-semibold">{data.yourValue}</p>
            </div>
            {data.benchmark && (
              <div>
                <p className="font-medium text-xs uppercase text-muted-foreground">Benchmark</p>
                <p>{data.benchmark}</p>
              </div>
            )}
            {data.suggestedAction && (
              <div className="rounded-md bg-primary/5 p-3">
                <p className="font-medium text-xs uppercase text-muted-foreground">Suggested action</p>
                <p>{data.suggestedAction}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
