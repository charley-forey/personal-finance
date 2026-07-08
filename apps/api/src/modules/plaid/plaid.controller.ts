import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Headers,
  Inject,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { eq, and } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { plaidItems } from '@pf/database';
import { AuthGuard, Public, getAuth, RequireRoles } from '../../common/auth.guard';
import { PlaidService } from '../../services/core.services';
import { DATABASE } from '../../database.module';
import { LinkExchangeDto } from '../../dto';
import { PlanLimitsGuard, RequirePlanLimit } from '../billing/plan-limits.guard';

@ApiTags('plaid')
@Controller()
@ApiBearerAuth()
export class PlaidController {
  constructor(
    private plaid: PlaidService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Post('plaid/link/token')
  @RequireRoles('admin')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async linkToken(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.plaid.createLinkToken(auth.userId, auth.orgId);
  }

  @Post('plaid/link/exchange')
  @RequireRoles('admin')
  @UseGuards(PlanLimitsGuard)
  @RequirePlanLimit('banks')
  async exchangeToken(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: LinkExchangeDto) {
    const auth = getAuth(req);
    return this.plaid.exchangePublicToken(body.publicToken, auth.orgId);
  }

  @Public()
  @Post('webhooks/plaid')
  async plaidWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('plaid-verification') verification?: string,
  ) {
    return this.plaid.handleWebhook(body, verification);
  }

  @Get('items')
  async plaidItems(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(plaidItems).where(eq(plaidItems.orgId, auth.orgId));
  }

  @Get('plaid/items')
  async listPlaidItems(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db
      .select({
        id: plaidItems.id,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        lastSyncedAt: plaidItems.lastSyncedAt,
        loginRequired: plaidItems.loginRequired,
        errorCode: plaidItems.errorCode,
      })
      .from(plaidItems)
      .where(eq(plaidItems.orgId, auth.orgId));
  }

  @Post('plaid/items/:id/sync')
  @RequireRoles('admin')
  async triggerSync(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    return this.plaid.enqueueSync(id, auth.orgId);
  }

  @Get('plaid/items/:id/health')
  async itemHealth(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    const [item] = await this.db
      .select({
        id: plaidItems.id,
        institutionName: plaidItems.institutionName,
        syncStatus: plaidItems.syncStatus,
        lastSyncedAt: plaidItems.lastSyncedAt,
        loginRequired: plaidItems.loginRequired,
        errorCode: plaidItems.errorCode,
        consentExpiresAt: plaidItems.consentExpiresAt,
        createdAt: plaidItems.createdAt,
      })
      .from(plaidItems)
      .where(and(eq(plaidItems.id, id), eq(plaidItems.orgId, auth.orgId)))
      .limit(1);

    if (!item) {
      throw new NotFoundException('Plaid item not found');
    }

    const healthy =
      item.syncStatus === 'success' && !item.loginRequired && !item.errorCode;

    return {
      itemId: item.id,
      institutionName: item.institutionName,
      syncStatus: item.syncStatus,
      lastSyncedAt: item.lastSyncedAt,
      loginRequired: item.loginRequired,
      error: item.errorCode
        ? { code: item.errorCode, message: item.errorCode }
        : null,
      consentExpiresAt: item.consentExpiresAt,
      healthy,
      stale: item.lastSyncedAt
        ? Date.now() - item.lastSyncedAt.getTime() > 24 * 60 * 60 * 1000
        : true,
    };
  }
}
