import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
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
import { plaidItems, auditLogs } from '@pf/database';
import { PLAID_STALE_MS } from '@pf/shared';
import { AuthGuard, Public, getAuth, RequireRoles } from '../../common/auth.guard';
import { PlaidService } from '../../services/core.services';
import { DATABASE } from '../../database.module';
import { LinkExchangeDto } from '../../dto';
import { PlanLimitsGuard, RequirePlanLimit } from '../billing/plan-limits.guard';
import { getDataQualityScorecard } from '@pf/sync';

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
  @UseGuards(PlanLimitsGuard)
  @RequirePlanLimit('banks')
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

  /** @deprecated Prefer GET /plaid/items — never returns access tokens */
  @Get('items')
  async plaidItemsLegacy(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.listPlaidItems(req);
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
        syncWarnings: plaidItems.syncWarnings,
        consentExpiresAt: plaidItems.consentExpiresAt,
      })
      .from(plaidItems)
      .where(eq(plaidItems.orgId, auth.orgId));
  }

  @Get('plaid/data-quality')
  async dataQuality(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return getDataQualityScorecard(this.db, auth.orgId);
  }

  @Post('plaid/items/:id/sync')
  @RequireRoles('admin')
  async triggerSync(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    return this.plaid.enqueueSync(id, auth.orgId);
  }

  @Delete('plaid/items/:id')
  @RequireRoles('admin')
  async disconnectItem(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Query('wipeHistory') wipeHistory?: string,
  ) {
    const auth = getAuth(req);
    const wipe = wipeHistory === '1' || wipeHistory === 'true';
    const [item] = await this.db
      .select({ id: plaidItems.id, institutionName: plaidItems.institutionName })
      .from(plaidItems)
      .where(and(eq(plaidItems.id, id), eq(plaidItems.orgId, auth.orgId)))
      .limit(1);
    if (!item) throw new NotFoundException('Plaid item not found');

    await this.plaid.removePlaidItem(id, auth.orgId, { wipeHistory: wipe });
    await this.db.insert(auditLogs).values({
      orgId: auth.orgId,
      userId: auth.userId,
      action: 'plaid.disconnect',
      entityType: 'plaid_item',
      entityId: id,
      metadataJson: { wipeHistory: wipe, institutionName: item.institutionName },
    });
    return { removed: true, wipeHistory: wipe };
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
        syncWarnings: plaidItems.syncWarnings,
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
      syncWarnings: item.syncWarnings ?? [],
      error: item.errorCode
        ? { code: item.errorCode, message: item.errorCode }
        : null,
      consentExpiresAt: item.consentExpiresAt,
      healthy,
      stale: item.lastSyncedAt
        ? Date.now() - item.lastSyncedAt.getTime() > PLAID_STALE_MS
        : true,
    };
  }
}
