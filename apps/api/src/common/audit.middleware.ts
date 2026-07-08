import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import type { Database } from '@pf/database';
import { auditLogs } from '@pf/database';
import type { AuthContext } from '@pf/shared';
import { DATABASE } from '../database.module';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

type AuthedRequest = Request & { auth?: AuthContext };

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(@Inject(DATABASE) private db: Database) {}

  use(req: AuthedRequest, res: Response, next: NextFunction): void {
    if (!MUTATING_METHODS.has(req.method)) {
      next();
      return;
    }

    const path = req.originalUrl ?? req.url;
    if (path.startsWith('/health') || path.includes('/webhook')) {
      next();
      return;
    }

    res.on('finish', () => {
      if (res.statusCode >= 400) return;

      void this.db
        .insert(auditLogs)
        .values({
          orgId: req.auth?.orgId ?? null,
          userId: req.auth?.userId ?? null,
          action: `${req.method} ${path}`,
          entityType: 'http_request',
          metadataJson: {
            method: req.method,
            path,
            statusCode: res.statusCode,
          },
          ip: req.ip ?? (req.headers['x-forwarded-for'] as string | undefined) ?? null,
        })
        .catch(() => undefined);
    });

    next();
  }
}
