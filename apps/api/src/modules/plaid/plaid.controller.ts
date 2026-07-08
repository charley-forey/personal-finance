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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { eq } from 'drizzle-orm';
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
}
