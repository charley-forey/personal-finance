import { Injectable, Inject } from '@nestjs/common';
import type { Database } from '@pf/database';
import { buildPageContext } from '@pf/context';
import { DATABASE } from '../database.module';

@Injectable()
export class ContextService {
  constructor(@Inject(DATABASE) private db: Database) {}

  pageContext(orgId: string, route: string) {
    return buildPageContext(this.db, orgId, route);
  }
}
