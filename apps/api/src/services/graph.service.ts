import { Injectable, Inject } from '@nestjs/common';
import type { Database } from '@pf/database';
import { getEntityNeighbors, getGraphContextForRoute, upsertEntityLink } from '@pf/graph';
import type { GraphEntityType, GraphLinkType } from '@pf/graph';
import { DATABASE } from '../database.module';

@Injectable()
export class GraphService {
  constructor(@Inject(DATABASE) private db: Database) {}

  neighbors(orgId: string, type: string, id: string) {
    return getEntityNeighbors(this.db, orgId, type as GraphEntityType, id);
  }

  context(orgId: string, route: string) {
    return getGraphContextForRoute(this.db, orgId, route);
  }

  link(
    orgId: string,
    body: {
      sourceType: GraphEntityType;
      sourceId: string;
      targetType: GraphEntityType;
      targetId: string;
      linkType: GraphLinkType;
      weight?: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    return upsertEntityLink(this.db, orgId, body);
  }
}
