import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { and, eq, gt } from 'drizzle-orm';
import type { Response } from 'express';
import type { Database } from '@pf/database';
import { domainEvents } from '@pf/database';
import { Inject } from '@nestjs/common';
import { AuthGuard, getAuth } from '../../common/auth.guard';
import { DATABASE } from '../../database.module';

const HEARTBEAT_MS = 30_000;
const POLL_MS = 2_000;

@ApiTags('events')
@Controller()
@ApiBearerAuth()
export class EventsController {
  constructor(@Inject(DATABASE) private db: Database) {}

  @SkipThrottle()
  @Get('events/stream')
  async stream(@Req() req: { auth?: ReturnType<typeof getAuth>; on: (event: string, cb: () => void) => void }, @Res() res: Response) {
    const auth = getAuth(req);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let lastSeen = new Date(0);
    let closed = false;

    const writeEvent = (event: string, data: unknown) => {
      if (closed) return;
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    writeEvent('connected', { orgId: auth.orgId });

    const heartbeat = setInterval(() => {
      writeEvent('heartbeat', { ts: Date.now() });
    }, HEARTBEAT_MS);

    const poll = setInterval(async () => {
      try {
        const events = await this.db
          .select()
          .from(domainEvents)
          .where(and(eq(domainEvents.orgId, auth.orgId), gt(domainEvents.occurredAt, lastSeen)))
          .orderBy(domainEvents.occurredAt);

        for (const event of events) {
          writeEvent('domain_event', {
            id: event.id,
            eventType: event.eventType,
            aggregateType: event.aggregateType,
            aggregateId: event.aggregateId,
            payloadJson: event.payloadJson,
            occurredAt: event.occurredAt,
          });
          lastSeen = event.occurredAt;
        }
      } catch {
        writeEvent('error', { message: 'poll_failed' });
      }
    }, POLL_MS);

    req.on('close', () => {
      closed = true;
      clearInterval(heartbeat);
      clearInterval(poll);
      res.end();
    });
  }
}
