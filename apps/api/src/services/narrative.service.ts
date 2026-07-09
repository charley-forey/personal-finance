import { Injectable, Inject } from '@nestjs/common';
import type { Database } from '@pf/database';
import { buildSessionNarrative, buildPageNarrative, explainMetric } from '@pf/narrative';
import { DATABASE } from '../database.module';

@Injectable()
export class NarrativeService {
  constructor(@Inject(DATABASE) private db: Database) {}

  session(orgId: string) {
    return buildSessionNarrative(this.db, orgId);
  }

  page(orgId: string, route: string) {
    return buildPageNarrative(this.db, orgId, route);
  }

  explain(orgId: string, metric: string) {
    return explainMetric(this.db, orgId, metric);
  }
}
