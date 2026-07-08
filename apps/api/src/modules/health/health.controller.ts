import { Controller, Get, Post, Body, Inject, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { sql } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { AuthGuard, Public } from '../../common/auth.guard';
import { isDevelopment } from '../../common/env.util';
import { AuthService } from '../../services/core.services';
import { DATABASE } from '../../database.module';
import { CreateSessionDto } from '../../dto';

@ApiTags('health')
@Controller()
@ApiBearerAuth()
export class HealthController {
  constructor(
    @Inject(AuthService) private auth: AuthService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Public()
  @SkipThrottle()
  @Get('health')
  async health() {
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: 'ok', service: 'personal-finance-api', version: '1.0.0', database: 'connected' };
    } catch {
      return { status: 'degraded', service: 'personal-finance-api', version: '1.0.0', database: 'disconnected' };
    }
  }

  @Public()
  @Post('auth/session')
  async createSession(@Body() body: CreateSessionDto) {
    if (!isDevelopment()) {
      throw new ForbiddenException('Dev session endpoint is disabled in production');
    }
    const auth = await this.auth.resolveContext(body.workosUserId, body.email, body.name);
    return { user: { id: auth.userId, email: auth.email }, token: `dev:${auth.orgId}:${auth.userId}:${auth.role}` };
  }
}
