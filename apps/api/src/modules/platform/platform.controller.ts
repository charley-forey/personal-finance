import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Inject,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { and, eq } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { createOpenAIClient, parseDocumentText, parseRuleFromText } from '@pf/ai';
import {
  notifications,
  verifications,
  manualAssets,
  documents,
  automationRules,
  entities,
  tags,
  taxLots,
  userPreferences,
} from '@pf/database';
import { AuthGuard, getAuth, RequireRoles } from '../../common/auth.guard';
import { PlatformAdminGuard } from '../../common/platform-admin.guard';
import { PlanLimitsGuard, RequirePlanLimit } from '../billing/plan-limits.guard';
import {
  NotificationService,
  FeatureFlagService,
  AdminService,
  IntegrationService,
  ReportService,
  VerificationService,
  AdvisorService,
  HouseholdService,
  ApiKeyService,
  ComplianceService,
} from '../../services/platform.services';
import { CategoryService } from '../../services/category.service';
import { AnalyticsService } from '../../services/analytics.services';
import { StorageService } from '../../services/storage.service';
import { DATABASE } from '../../database.module';

@ApiTags('platform')
@Controller()
@ApiBearerAuth()
export class PlatformController {
  constructor(
    private notifications_svc: NotificationService,
    private featureFlags: FeatureFlagService,
    private admin: AdminService,
    private integrations: IntegrationService,
    private reports: ReportService,
    private verificationSvc: VerificationService,
    private categories: CategoryService,
    private advisor: AdvisorService,
    private households: HouseholdService,
    private apiKeys: ApiKeyService,
    private analytics: AnalyticsService,
    private compliance: ComplianceService,
    private storage: StorageService,
    private config: ConfigService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Get('notifications')
  async notifications(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(notifications).where(eq(notifications.orgId, auth.orgId));
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    return this.notifications_svc.markRead(id, getAuth(req).orgId);
  }

  @Get('verifications')
  async verifications(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(verifications).where(eq(verifications.orgId, auth.orgId));
  }

  @Post('verifications/reconcile')
  async reconcile(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.verificationSvc.runReconciliation(auth.orgId);
  }

  @Get('assets/manual')
  async manualAssets(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(manualAssets).where(eq(manualAssets.orgId, auth.orgId));
  }

  @Post('assets/manual')
  @RequireRoles('admin')
  async createManualAsset(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [asset] = await this.db
      .insert(manualAssets)
      .values({
        orgId: auth.orgId,
        assetType: body.assetType as string,
        name: body.name as string,
        currentValue: (body.currentValue as number).toString(),
      })
      .returning();
    return asset;
  }

  @Patch('assets/manual/:id')
  @RequireRoles('admin')
  async updateManualAsset(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const auth = getAuth(req);
    const [asset] = await this.db
      .update(manualAssets)
      .set({
        assetType: body.assetType as string,
        name: body.name as string,
        currentValue: body.currentValue != null ? String(body.currentValue) : undefined,
      })
      .where(and(eq(manualAssets.id, id), eq(manualAssets.orgId, auth.orgId)))
      .returning();
    return asset;
  }

  @Delete('assets/manual/:id')
  @RequireRoles('admin')
  async deleteManualAsset(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    const [asset] = await this.db
      .delete(manualAssets)
      .where(and(eq(manualAssets.id, id), eq(manualAssets.orgId, auth.orgId)))
      .returning();
    return asset;
  }

  @Get('documents')
  async documents(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(documents).where(eq(documents.orgId, auth.orgId));
  }

  @Post('documents/upload-url')
  async documentUploadUrl(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Body() body: { filename: string; contentType?: string },
  ) {
    const auth = getAuth(req);
    return this.storage.createUploadUrl(
      auth.orgId,
      body.filename,
      body.contentType ?? 'application/octet-stream',
    );
  }

  @Post('documents')
  @UseGuards(PlanLimitsGuard)
  @RequirePlanLimit('documents')
  async createDocument(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [doc] = await this.db
      .insert(documents)
      .values({
        orgId: auth.orgId,
        documentType: (body.documentType as 'other') ?? 'other',
        filename: body.filename as string,
        storageKey: body.storageKey as string,
        taxYear: body.taxYear as number,
        uploadedBy: auth.userId,
      })
      .returning();
    return doc;
  }

  @Post('documents/:id/parse')
  async parseDocument(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: { rawText?: string },
  ) {
    const auth = getAuth(req);
    const [doc] = await this.db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.orgId, auth.orgId)))
      .limit(1);
    if (!doc) throw new NotFoundException('Document not found');

    await this.db
      .update(documents)
      .set({ parsedStatus: 'processing' })
      .where(eq(documents.id, id));

    const rawText =
      body.rawText ??
      `Document: ${doc.filename}\nType: ${doc.documentType}\nTax year: ${doc.taxYear ?? 'unknown'}`;

    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    let extracted: Record<string, unknown>;

    if (!apiKey || apiKey.includes('1234567890')) {
      extracted = {
        documentType: doc.documentType,
        taxYear: doc.taxYear,
        stub: true,
        message: 'Configure OPENAI_API_KEY for full extraction',
      };
    } else {
      const client = createOpenAIClient(apiKey);
      extracted = await parseDocumentText(client, doc.documentType, rawText);
    }

    const [updated] = await this.db
      .update(documents)
      .set({ parsedStatus: 'completed', extractedDataJson: extracted })
      .where(eq(documents.id, id))
      .returning();

    return updated;
  }

  @Get('rules')
  async rules(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(automationRules).where(eq(automationRules.orgId, auth.orgId));
  }

  @Post('rules')
  @RequireRoles('admin')
  async createRule(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [rule] = await this.db
      .insert(automationRules)
      .values({
        orgId: auth.orgId,
        name: body.name as string,
        triggerType: body.triggerType as string,
        actionType: body.actionType as string,
        triggerConditionsJson: body.conditions as Record<string, unknown>,
        actionConfigJson: body.action as Record<string, unknown>,
        enabled: body.enabled !== false,
      })
      .returning();
    return rule;
  }

  @Patch('rules/:id')
  @RequireRoles('admin')
  async updateRule(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const auth = getAuth(req);
    const [rule] = await this.db
      .update(automationRules)
      .set({
        name: body.name as string | undefined,
        triggerType: body.triggerType as string | undefined,
        actionType: body.actionType as string | undefined,
        triggerConditionsJson: body.conditions as Record<string, unknown> | undefined,
        actionConfigJson: body.action as Record<string, unknown> | undefined,
        enabled: body.enabled as boolean | undefined,
      })
      .where(and(eq(automationRules.id, id), eq(automationRules.orgId, auth.orgId)))
      .returning();
    return rule;
  }

  @Delete('rules/:id')
  @RequireRoles('admin')
  async deleteRule(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    const [rule] = await this.db
      .delete(automationRules)
      .where(and(eq(automationRules.id, id), eq(automationRules.orgId, auth.orgId)))
      .returning();
    return rule;
  }

  @Post('rules/from-text')
  @RequireRoles('admin')
  async createRuleFromText(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { description: string }) {
    const auth = getAuth(req);
    const apiKey = this.config.get<string>('OPENAI_API_KEY');

    let parsed: Awaited<ReturnType<typeof parseRuleFromText>>;
    if (!apiKey || apiKey.includes('1234567890')) {
      parsed = {
        name: body.description.slice(0, 60),
        triggerType: 'budget.exceeded',
        actionType: 'notify',
        triggerConditionsJson: {},
        actionConfigJson: { title: 'Budget alert', body: body.description },
      };
    } else {
      const client = createOpenAIClient(apiKey);
      parsed = await parseRuleFromText(client, body.description);
    }

    const [rule] = await this.db
      .insert(automationRules)
      .values({
        orgId: auth.orgId,
        name: parsed.name,
        triggerType: parsed.triggerType,
        actionType: parsed.actionType,
        triggerConditionsJson: parsed.triggerConditionsJson,
        actionConfigJson: parsed.actionConfigJson,
      })
      .returning();

    return rule;
  }

  @Get('admin/orgs')
  @UseGuards(PlatformAdminGuard)
  @RequireRoles('owner')
  async adminSearch(@Query('q') q: string) {
    return this.admin.searchOrgs(q ?? '');
  }

  @Get('integrations/providers')
  async integrationProviders() {
    return this.integrations.listProviders();
  }

  @Post('reports/cpa-pack')
  async cpaPack(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.reports.generateCpaPack(auth.orgId);
  }

  @Get('feature-flags')
  async flags(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return {
      ai_agents: await this.featureFlags.isEnabled('ai_agents', auth.orgId),
      monte_carlo: await this.featureFlags.isEnabled('monte_carlo', auth.orgId),
      tax_center: await this.featureFlags.isEnabled('tax_center', auth.orgId),
      advisor_portal: await this.featureFlags.isEnabled('advisor_portal', auth.orgId),
    };
  }

  @Get('categories')
  async listCategories(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.categories.list(getAuth(req).orgId);
  }

  @Get('categories/groups')
  async categoryGroups(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.categories.listGroups(getAuth(req).orgId);
  }

  @Post('categories')
  @RequireRoles('admin')
  async createCategory(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    return this.categories.create(getAuth(req).orgId, body as { name: string; groupId?: string; pnlRowKey?: string });
  }

  @Post('categories/rules')
  @RequireRoles('admin')
  async createCategoryRule(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    return this.categories.createRule(getAuth(req).orgId, body as { matchType: string; pattern: string; categoryId: string });
  }

  @Post('categories/recategorize')
  @RequireRoles('admin')
  async recategorize(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const count = await this.categories.recategorizeAll(getAuth(req).orgId);
    return { recategorized: count };
  }

  @Get('inbox')
  async inbox(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.categories.getInbox(getAuth(req).orgId);
  }

  @Get('activity')
  async activityFeed(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.analytics.getActivityFeed(getAuth(req).orgId);
  }

  @Get('preferences')
  async getPreferences(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const [prefs] = await this.db.select().from(userPreferences).where(eq(userPreferences.userId, auth.userId)).limit(1);
    return prefs ?? { currency: 'USD', timezone: 'America/New_York', notificationSettingsJson: {} };
  }

  @Put('preferences')
  async updatePreferences(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [existing] = await this.db.select().from(userPreferences).where(eq(userPreferences.userId, auth.userId)).limit(1);
    if (existing) {
      const [updated] = await this.db
        .update(userPreferences)
        .set({
          currency: (body.currency as string) ?? existing.currency,
          timezone: (body.timezone as string) ?? existing.timezone,
          notificationSettingsJson: (body.notificationSettingsJson as Record<string, unknown>) ?? existing.notificationSettingsJson,
        })
        .where(eq(userPreferences.userId, auth.userId))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(userPreferences)
      .values({
        userId: auth.userId,
        currency: (body.currency as string) ?? 'USD',
        timezone: (body.timezone as string) ?? 'America/New_York',
        notificationSettingsJson: body.notificationSettingsJson as Record<string, unknown>,
      })
      .returning();
    return created;
  }

  @Get('entities')
  async listEntities(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.db.select().from(entities).where(eq(entities.orgId, getAuth(req).orgId));
  }

  @Post('entities')
  @RequireRoles('admin')
  async createEntity(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [entity] = await this.db
      .insert(entities)
      .values({
        orgId: auth.orgId,
        entityType: (body.entityType as 'personal') ?? 'personal',
        name: body.name as string,
        ein: body.ein as string,
      })
      .returning();
    return entity;
  }

  @Get('tags')
  async listTags(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.db.select().from(tags).where(eq(tags.orgId, getAuth(req).orgId));
  }

  @Post('tags')
  async createTag(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { name: string; color?: string }) {
    const auth = getAuth(req);
    const [tag] = await this.db.insert(tags).values({ orgId: auth.orgId, name: body.name, color: body.color }).returning();
    return tag;
  }

  @Get('tax-lots')
  async taxLots(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.db.select().from(taxLots).where(eq(taxLots.orgId, getAuth(req).orgId));
  }

  @Post('advisor/firms')
  async createAdvisorFirm(@Body() body: { name: string }) {
    return this.advisor.createFirm(body.name);
  }

  @Post('advisor/clients')
  async linkAdvisorClient(@Body() body: { firmId: string; orgId: string; advisorUserId?: string }) {
    return this.advisor.linkClient(body.firmId, body.orgId, body.advisorUserId);
  }

  @Get('advisor/firms/:firmId/clients')
  async listAdvisorClients(@Param('firmId') firmId: string) {
    return this.advisor.listClients(firmId);
  }

  @Get('households')
  async listHouseholds(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.households.list(getAuth(req).orgId);
  }

  @Post('households')
  async createHousehold(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { name: string }) {
    return this.households.create(getAuth(req).orgId, body.name);
  }

  @Get('api-keys')
  @RequireRoles('owner')
  async listApiKeys(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.apiKeys.list(getAuth(req).orgId);
  }

  @Post('api-keys')
  @RequireRoles('owner')
  async createApiKey(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { name: string; scopes: string[] }) {
    return this.apiKeys.create(getAuth(req).orgId, body.name, body.scopes);
  }

  @Get('compliance/audit-logs')
  async complianceAuditLogs(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.compliance.listAuditLogs(getAuth(req).orgId);
  }

  @Get('compliance/export')
  async complianceExport(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.compliance.exportOrgData(auth.orgId, auth.userId);
  }

  @Delete('compliance/account')
  @RequireRoles('owner')
  async complianceDeleteAccount(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.compliance.deleteAccount(auth.orgId, auth.userId);
  }
}
