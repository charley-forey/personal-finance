'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGraphNeighbors, useGraphContext } from '@/hooks/use-finance';
import { Badge, Skeleton, Button } from '@/components/ui';
import { ChevronDown, ChevronUp, Network } from 'lucide-react';

interface EntityGraphPanelProps {
  entityType?: string;
  entityId?: string;
  route?: string;
  className?: string;
}

export function EntityGraphPanel({ entityType, entityId, route, className }: EntityGraphPanelProps) {
  const [open, setOpen] = useState(false);
  const { data: neighbors, isLoading: loadingNeighbors } = useGraphNeighbors(
    entityType && entityId ? entityType : undefined,
    entityType && entityId ? entityId : undefined,
  );
  const { data: graphCtx, isLoading: loadingCtx } = useGraphContext(route);

  const links = neighbors?.neighbors?.length
    ? neighbors.neighbors
    : graphCtx?.suggestedLinks ?? [];

  if (!entityType && !route) return null;

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <Network className="w-4 h-4" />
          Connected ({links.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      {open && (
        <div className="mt-2 space-y-2 rounded-lg border border-border/60 p-3">
          {(loadingNeighbors || loadingCtx) && <Skeleton className="h-16 w-full" />}
          {!loadingNeighbors && !loadingCtx && links.length === 0 && (
            <p className="text-xs text-muted-foreground">No linked entities yet.</p>
          )}
          {links.map((link, i) => (
            <div key={`${link.node.id}-${i}`} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{link.node.label}</p>
                <Badge variant="info" className="text-[10px] mt-0.5">
                  {link.edge.linkType}
                </Badge>
              </div>
              {link.node.route && (
                <Link href={link.node.route} className="text-xs text-primary shrink-0 hover:underline">
                  Open
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
