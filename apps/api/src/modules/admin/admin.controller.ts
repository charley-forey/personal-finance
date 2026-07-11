import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthContext, PlatformAdminContext, PlatformRole, PlanTier } from '@pf/shared';
import { getAuth } from '../../common/auth.guard';
import {
  PlatformAdminGuard,
  RequirePlatformPermissions,
  PlatformAdminOptional,
  type RequestWithPlatform,
} from '../../common/platform-admin.guard';
import { AdminRbacService, AdminDirectoryService } from './admin-directory.service';
import { AdminMetricsService, AdminControlService } from './admin-ops.service';
import {
  AdminOpsReliabilityService,
  AdminSupportService,
  AdminTrustService,
  AdminAiGovService,
  AdminScaleService,
} from './admin-support.service';

function platform(req: RequestWithPlatform): PlatformAdminContext {
  if (!req.platformAdmin?.isPlatformAdmin) {
    throw new Error('Platform admin context missing');
  }
  return req.platformAdmin;
}

@Controller('admin/v1')
@UseGuards(PlatformAdminGuard)
export class AdminController {
  constructor(
    private rbac: AdminRbacService,
    private directory: AdminDirectoryService,
    private metrics: AdminMetricsService,
    private control: AdminControlService,
    private ops: AdminOpsReliabilityService,
    private support: AdminSupportService,
    private trust: AdminTrustService,
    private aiGov: AdminAiGovService,
    private scale: AdminScaleService,
  ) {}

  // ─── P0: me / admins ───────────────────────────────────────────
  @Get('me')
  @PlatformAdminOptional()
  async me(@Req() req: RequestWithPlatform) {
    const auth = getAuth(req as { auth?: AuthContext });
    const ctx = await this.rbac.resolveContext(auth);
    return {
      ...ctx,
      environment: process.env.NODE_ENV ?? 'development',
    };
  }

  @Get('admins')
  @RequirePlatformPermissions('admins:manage')
  listAdmins() {
    return this.rbac.listAdmins();
  }

  @Post('admins')
  @RequirePlatformPermissions('admins:manage')
  upsertAdmin(
    @Req() req: RequestWithPlatform,
    @Body() body: { email: string; role: PlatformRole },
  ) {
    return this.rbac.upsertAdmin(body.email, body.role, platform(req));
  }

  @Delete('admins/:id')
  @RequirePlatformPermissions('admins:manage')
  deactivateAdmin(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.rbac.deactivateAdmin(id, platform(req));
  }

  // ─── P1: directory ─────────────────────────────────────────────
  @Get('orgs')
  @RequirePlatformPermissions('orgs:read')
  searchOrgs(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
  ) {
    return this.directory.searchOrgs({
      q,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 25,
      status,
      plan,
    });
  }

  @Get('orgs/:id')
  @RequirePlatformPermissions('orgs:read')
  getOrg(@Param('id') id: string) {
    return this.directory.getOrg(id);
  }

  @Get('orgs/:id/timeline')
  @RequirePlatformPermissions('orgs:read')
  orgTimeline(@Param('id') id: string) {
    return this.directory.orgTimeline(id);
  }

  @Get('users')
  @RequirePlatformPermissions('users:read')
  searchUsers(@Query('q') q?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.directory.searchUsers({
      q,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 25,
    });
  }

  @Get('users/:id')
  @RequirePlatformPermissions('users:read')
  getUser(@Param('id') id: string) {
    return this.directory.getUser(id);
  }

  @Get('search')
  @RequirePlatformPermissions('orgs:read')
  search(@Query('q') q: string) {
    return this.directory.universalSearch(q ?? '');
  }

  // ─── P2: metrics / command center ──────────────────────────────
  @Get('metrics/overview')
  @RequirePlatformPermissions('metrics:read')
  overview() {
    return this.metrics.overview();
  }

  @Get('metrics/funnel')
  @RequirePlatformPermissions('metrics:read')
  funnel() {
    return this.metrics.funnel();
  }

  @Get('metrics/ai')
  @RequirePlatformPermissions('metrics:read')
  aiMetrics() {
    return this.metrics.aiMetrics();
  }

  @Get('metrics/insights')
  @RequirePlatformPermissions('metrics:read')
  insights() {
    return this.metrics.insightsSummary();
  }

  @Get('plaid/health')
  @RequirePlatformPermissions('orgs:read')
  plaidHealth() {
    return this.metrics.plaidHealth();
  }

  @Get('alerts')
  @RequirePlatformPermissions('metrics:read')
  alerts() {
    return this.metrics.listAlerts();
  }

  @Post('alerts/refresh')
  @RequirePlatformPermissions('metrics:read')
  refreshAlerts() {
    return this.metrics.ensureThresholdAlerts();
  }

  @Post('alerts/:id/acknowledge')
  @RequirePlatformPermissions('metrics:read')
  ackAlert(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.metrics.acknowledgeAlert(id, platform(req), this.rbac);
  }

  @Get('scorecard/weekly')
  @RequirePlatformPermissions('metrics:read')
  weeklyScorecard() {
    return this.metrics.weeklyScorecard();
  }

  // ─── P3: control + finops ──────────────────────────────────────
  @Patch('orgs/:id/plan')
  @RequirePlatformPermissions('billing:write')
  updatePlan(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body() body: { planTier: PlanTier; reason: string },
  ) {
    return this.control.updateOrgPlan(id, body.planTier, body.reason, platform(req));
  }

  @Patch('orgs/:id/status')
  @RequirePlatformPermissions('orgs:write')
  updateStatus(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'suspended' | 'pending_deletion'; reason: string },
  ) {
    return this.control.updateOrgStatus(id, body.status, body.reason, platform(req));
  }

  @Patch('orgs/:id/members/:userId')
  @RequirePlatformPermissions('orgs:write')
  updateMember(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'owner' | 'admin' | 'viewer'; reason: string },
  ) {
    return this.control.updateMemberRole(id, userId, body.role, body.reason, platform(req));
  }

  @Get('feature-flags')
  @RequirePlatformPermissions('flags:read')
  listFlags() {
    return this.control.listFlags();
  }

  @Post('feature-flags')
  @RequirePlatformPermissions('flags:write')
  upsertFlag(
    @Req() req: RequestWithPlatform,
    @Body()
    body: { key: string; enabled: boolean; orgOverrides?: Record<string, boolean>; reason: string },
  ) {
    return this.control.upsertFlag(body.key, body.enabled, body.orgOverrides, body.reason, platform(req));
  }

  @Post('orgs/:id/entitlements')
  @RequirePlatformPermissions('billing:write')
  entitlements(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body()
    body: {
      maxBanks?: number;
      maxAiMessagesMonthly?: number;
      maxDocuments?: number;
      historyDays?: number;
      reason: string;
      expiresAt?: string;
    },
  ) {
    return this.control.createEntitlementOverride(id, body, platform(req));
  }

  @Post('orgs/:id/comp-grants')
  @RequirePlatformPermissions('billing:write')
  compGrant(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body() body: { planTier: PlanTier; reason: string; expiresAt?: string },
  ) {
    return this.control.createCompGrant(id, body.planTier, body.reason, body.expiresAt, platform(req));
  }

  @Get('billing/subscriptions')
  @RequirePlatformPermissions('billing:read')
  subscriptions(@Query('status') status?: string, @Query('page') page?: string) {
    return this.control.listSubscriptions({ status, page: page ? Number(page) : 1 });
  }

  @Get('billing/outliers')
  @RequirePlatformPermissions('billing:read')
  outliers() {
    return this.control.usageOutliers();
  }

  // ─── P4: ops ───────────────────────────────────────────────────
  @Get('ops/queues')
  @RequirePlatformPermissions('queues:manage')
  queues() {
    return this.ops.queueStatus();
  }

  @Post('ops/queues/:queue/jobs/:jobId/redrive')
  @RequirePlatformPermissions('queues:manage')
  redrive(
    @Req() req: RequestWithPlatform,
    @Param('queue') queue: string,
    @Param('jobId') jobId: string,
  ) {
    return this.ops.redriveFailed(queue, jobId, platform(req));
  }

  @Get('ops/kill-switches')
  @RequirePlatformPermissions('queues:manage')
  killSwitches() {
    return this.ops.killSwitches();
  }

  @Post('ops/plaid/:itemId/force-sync')
  @RequirePlatformPermissions('queues:manage')
  forceSync(@Req() req: RequestWithPlatform, @Param('itemId') itemId: string) {
    return this.ops.forceSyncItem(itemId, platform(req));
  }

  @Post('ops/incident')
  @RequirePlatformPermissions('flags:write')
  incident(@Req() req: RequestWithPlatform, @Body() body: { enable: boolean; reason: string }) {
    return this.ops.incidentMode(body.enable, body.reason, platform(req));
  }

  @Get('ops/health')
  @RequirePlatformPermissions('metrics:read')
  deepHealth() {
    return this.ops.deepHealth();
  }

  // ─── P5: trust ─────────────────────────────────────────────────
  @Get('audit/admin')
  @RequirePlatformPermissions('audit:read')
  adminAudit(@Query('q') q?: string, @Query('orgId') orgId?: string) {
    return this.rbac.listAdminAudit({ q, orgId });
  }

  @Get('audit/tenant')
  @RequirePlatformPermissions('audit:read')
  tenantAudit(@Query('q') q?: string, @Query('orgId') orgId?: string) {
    return this.trust.searchTenantAudit({ q, orgId });
  }

  @Get('dsar')
  @RequirePlatformPermissions('dsar:execute')
  listDsar() {
    return this.trust.listDsar();
  }

  @Post('dsar')
  @RequirePlatformPermissions('dsar:execute')
  createDsar(
    @Req() req: RequestWithPlatform,
    @Body() body: { orgId: string; userId?: string; requestType: 'export' | 'delete'; reason?: string },
  ) {
    return this.trust.createDsar(body, platform(req));
  }

  @Post('dsar/:id/approve')
  @RequirePlatformPermissions('dsar:execute')
  approveDsar(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.trust.approveDsar(id, platform(req));
  }

  @Post('dsar/:id/execute')
  @RequirePlatformPermissions('dsar:execute')
  executeDsar(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.trust.executeDsar(id, platform(req));
  }

  @Get('trust/access-review')
  @RequirePlatformPermissions('admins:manage')
  accessReview() {
    return this.trust.accessReview();
  }

  @Get('trust/sso')
  @RequirePlatformPermissions('audit:read')
  sso() {
    return this.trust.ssoStatus();
  }

  @Get('trust/evidence-pack')
  @RequirePlatformPermissions('audit:read')
  evidence() {
    return this.trust.evidencePack();
  }

  // ─── P6: support ───────────────────────────────────────────────
  @Get('support/playbooks')
  @RequirePlatformPermissions('support:write')
  playbooks() {
    return this.support.playbooks();
  }

  @Get('support/cases')
  @RequirePlatformPermissions('support:write')
  cases(@Query('status') status?: string) {
    return this.support.listCases(status);
  }

  @Post('orgs/:id/notes')
  @RequirePlatformPermissions('support:write')
  addNote(@Req() req: RequestWithPlatform, @Param('id') id: string, @Body() body: { body: string }) {
    return this.support.addNote(id, body.body, platform(req));
  }

  @Post('orgs/:id/cases')
  @RequirePlatformPermissions('support:write')
  createCase(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body() body: { subject: string; priority?: string; playbookKey?: string },
  ) {
    return this.support.createCase(id, body, platform(req));
  }

  @Patch('support/cases/:id')
  @RequirePlatformPermissions('support:write')
  updateCase(@Req() req: RequestWithPlatform, @Param('id') id: string, @Body() body: { status: string }) {
    return this.support.updateCaseStatus(id, body.status, platform(req));
  }

  @Post('orgs/:id/impersonate')
  @RequirePlatformPermissions('impersonate')
  impersonate(
    @Req() req: RequestWithPlatform,
    @Param('id') id: string,
    @Body() body: { reason: string; targetUserId?: string; minutes?: number; stepUpToken?: string },
  ) {
    return this.support.startImpersonation(id, body.reason, platform(req), body);
  }

  @Post('impersonation/:id/revoke')
  @RequirePlatformPermissions('impersonate')
  revokeImpersonation(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.support.revokeImpersonation(id, platform(req));
  }

  @Get('impersonation/active')
  @RequirePlatformPermissions('impersonate')
  activeImpersonation(@Req() req: RequestWithPlatform) {
    return this.support.activeImpersonations(platform(req).email);
  }

  // ─── P7: AI gov ────────────────────────────────────────────────
  @Get('ai/prompts')
  @RequirePlatformPermissions('ai:gov')
  prompts() {
    return this.aiGov.listPrompts();
  }

  @Post('ai/prompts/:id/activate')
  @RequirePlatformPermissions('ai:gov')
  activatePrompt(@Req() req: RequestWithPlatform, @Param('id') id: string) {
    return this.aiGov.activatePrompt(id, platform(req));
  }

  @Get('ai/evals')
  @RequirePlatformPermissions('ai:gov')
  evals() {
    return this.aiGov.listEvals();
  }

  @Post('ai/copilot')
  @RequirePlatformPermissions('ai:gov')
  copilot(@Req() req: RequestWithPlatform, @Body() body: { question: string }) {
    return this.aiGov.copilot(body.question, platform(req));
  }

  // ─── P8: scale ─────────────────────────────────────────────────
  @Get('advisor/firms')
  @RequirePlatformPermissions('advisor:read')
  firms() {
    return this.scale.listFirms();
  }

  @Get('developer/api-keys')
  @RequirePlatformPermissions('audit:read')
  apiKeys() {
    return this.scale.apiKeyAbuse();
  }

  @Get('developer/webhooks')
  @RequirePlatformPermissions('queues:manage')
  webhooks() {
    return this.scale.webhookHealth();
  }

  @Get('experiments')
  @RequirePlatformPermissions('metrics:read')
  experiments() {
    return this.scale.experiments();
  }

  @Post('warehouse/export')
  @RequirePlatformPermissions('metrics:read')
  warehouse(@Req() req: RequestWithPlatform) {
    return this.scale.exportWarehouseSnapshot(platform(req));
  }
}
