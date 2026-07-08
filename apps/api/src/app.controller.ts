import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, Public, getAuth, RequireRoles, RolesGuard } from './common/auth.guard';
import { PlaidService, AuthService } from './services/core.services';
import { AnalyticsService, PnlService, TaxService } from './services/analytics.services';
import {
  BillingService,
  NotificationService,
  FeatureFlagService,
  AdminService,
  IntegrationService,
  ReportService,
  VerificationService,
  KnowledgeService,
} from './services/platform.services';
import { DATABASE } from './database.module';
import type { Database } from '@pf/database';
import { eq, desc, and } from 'drizzle-orm';
import {
  accounts,
  transactions,
  plaidItems,
  insights,
  notifications,
  financialGoals,
  budgets,
  investmentHoldings,
  liabilities,
  recurringStreams,
  manualAssets,
  documents,
  verifications,
  automationRules,
  lifePlans,
  equityGrants,
  scenarios,
  forecasts,
} from '@pf/database';
import { simulateDebtPayoff, calculateFIRE, forecastCashFlow } from '@pf/analytics';

@ApiTags('api')
@Controller()
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppController {
  constructor(
    private plaid: PlaidService,
    private auth: AuthService,
    private analytics: AnalyticsService,
    private pnl: PnlService,
    private tax: TaxService,
    private billing: BillingService,
    private notifications_svc: NotificationService,
    private featureFlags: FeatureFlagService,
    private admin: AdminService,
    private integrations: IntegrationService,
    private reports: ReportService,
    private verificationSvc: VerificationService,
    private knowledge: KnowledgeService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Public()
  @Get('health')
  health() {
    return { status: 'ok', service: 'personal-finance-api', version: '1.0.0' };
  }

  @Post('auth/session')
  async createSession(@Body() body: { workosUserId: string; email: string; name?: string }) {
    const user = await this.auth.ensureUser(body.workosUserId, body.email, body.name);
    return { user, token: `dev:${user!.id}:${user!.id}:owner` };
  }

  @Post('plaid/link/token')
  @RequireRoles('admin')
  async linkToken(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.plaid.createLinkToken(auth.userId, auth.orgId);
  }

  @Post('plaid/link/exchange')
  @RequireRoles('admin')
  async exchangeToken(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { publicToken: string }) {
    const auth = getAuth(req);
    return this.plaid.exchangePublicToken(body.publicToken, auth.orgId);
  }

  @Public()
  @Post('webhooks/plaid')
  async plaidWebhook(@Body() body: Record<string, unknown>) {
    return this.plaid.handleWebhook(body);
  }

  @Get('accounts')
  async listAccounts(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(accounts).where(eq(accounts.orgId, auth.orgId));
  }

  @Get('accounts/:id')
  async getAccount(@Param('id') id: string) {
    const [account] = await this.db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
    return account;
  }

  @Get('transactions')
  async listTransactions(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    const auth = getAuth(req);
    return this.db
      .select()
      .from(transactions)
      .where(eq(transactions.orgId, auth.orgId))
      .orderBy(desc(transactions.date))
      .limit(parseInt(limit))
      .offset(parseInt(offset));
  }

  @Patch('transactions/:id')
  @RequireRoles('admin')
  async updateTransaction(
    @Param('id') id: string,
    @Body() body: { categoryId?: string; notes?: string },
  ) {
    const [updated] = await this.db
      .update(transactions)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updated;
  }

  @Get('net-worth')
  async netWorth(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    await this.analytics.computeDailySnapshot(auth.orgId);
    const current = await this.analytics.getNetWorth(auth.orgId);
    const history = await this.analytics.getNetWorthHistory(auth.orgId);
    return { current, history };
  }

  @Get('cash-flow')
  async cashFlow(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const txns = await this.db.select().from(transactions).where(eq(transactions.orgId, auth.orgId));
    let income = 0;
    let expenses = 0;
    for (const t of txns) {
      const amt = parseFloat(t.amount);
      if (amt < 0) income += Math.abs(amt);
      else expenses += amt;
    }
    return {
      income,
      expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? (income - expenses) / income : 0,
    };
  }

  @Get('pnl/:year/:month')
  async getPnl(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    const auth = getAuth(req);
    return this.pnl.getPeriod(auth.orgId, parseInt(year), parseInt(month));
  }

  @Post('pnl/:periodId/cells')
  @RequireRoles('admin')
  async updatePnlCell(
    @Param('periodId') periodId: string,
    @Body() body: { rowKey: string; columnKey: string; value: number },
  ) {
    return this.pnl.updateCell(periodId, body.rowKey, body.columnKey, body.value);
  }

  @Get('budgets')
  async listBudgets(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(budgets).where(eq(budgets.orgId, auth.orgId));
  }

  @Post('budgets')
  @RequireRoles('admin')
  async createBudget(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [budget] = await this.db
      .insert(budgets)
      .values({
        orgId: auth.orgId,
        categoryId: body.categoryId as string,
        periodStart: body.periodStart as string,
        periodEnd: body.periodEnd as string,
        amount: (body.amount as number).toString(),
      })
      .returning();
    return budget;
  }

  @Get('investments/holdings')
  async holdings(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(investmentHoldings).where(eq(investmentHoldings.orgId, auth.orgId));
  }

  @Get('liabilities')
  async listLiabilities(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(liabilities).where(eq(liabilities.orgId, auth.orgId));
  }

  @Get('recurring')
  async recurring(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(recurringStreams).where(eq(recurringStreams.orgId, auth.orgId));
  }

  @Get('goals')
  async goals(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(financialGoals).where(eq(financialGoals.orgId, auth.orgId));
  }

  @Post('goals')
  async createGoal(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [goal] = await this.db
      .insert(financialGoals)
      .values({
        orgId: auth.orgId,
        name: body.name as string,
        goalType: (body.goalType as 'custom') ?? 'custom',
        targetAmount: (body.targetAmount as number)?.toString(),
        targetDate: body.targetDate as string,
      })
      .returning();
    return goal;
  }

  @Post('forecasts/monte-carlo')
  async monteCarlo(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    return this.analytics.runMonteCarloSimulation(auth.orgId, body);
  }

  @Get('forecasts/cash-flow')
  async cashFlowForecast(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const nw = await this.analytics.getNetWorth(auth.orgId);
    const series = forecastCashFlow(36, nw.netWorth, 8000, 6000);
    const [forecast] = await this.db
      .insert(forecasts)
      .values({
        orgId: auth.orgId,
        forecastType: 'cash_flow',
        horizonMonths: 36,
        seriesJson: { series },
      })
      .returning();
    return { forecast, series };
  }

  @Get('insights')
  async listInsights(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db
      .select()
      .from(insights)
      .where(eq(insights.orgId, auth.orgId))
      .orderBy(desc(insights.generatedAt))
      .limit(20);
  }

  @Post('insights/generate')
  async generateInsight(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.analytics.generateAiInsight(auth.orgId);
  }

  @Get('health-score')
  async healthScore(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.analytics.computeHealthScore(auth.orgId);
  }

  @Post('agents/chat')
  async agentChat(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Body() body: { agentType: string; message: string },
  ) {
    const auth = getAuth(req);
    return this.analytics.chatAgent(
      auth.orgId,
      auth.userId,
      body.agentType as 'general_cfo',
      body.message,
    );
  }

  @Get('taxes/estimate')
  async taxEstimate(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.tax.estimate(auth.orgId);
  }

  @Post('debt/simulate')
  async debtSimulate(@Body() body: { debts: Array<{ name: string; balance: number; interestRate: number; minimumPayment: number }>; extraPayment: number; strategy: 'avalanche' | 'snowball' }) {
    return simulateDebtPayoff(body.debts, body.extraPayment, body.strategy);
  }

  @Get('fire')
  async fire(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const nw = await this.analytics.getNetWorth(auth.orgId);
    return calculateFIRE(60000, nw.netWorth, 12000);
  }

  @Get('notifications')
  async notifications(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(notifications).where(eq(notifications.orgId, auth.orgId));
  }

  @Get('verifications')
  async verifications(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(verifications).where(eq(verifications.orgId, auth.orgId));
  }

  @Get('items')
  async plaidItems(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(plaidItems).where(eq(plaidItems.orgId, auth.orgId));
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

  @Get('documents')
  async documents(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(documents).where(eq(documents.orgId, auth.orgId));
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
      })
      .returning();
    return rule;
  }

  @Get('life-plans')
  async lifePlans(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(lifePlans).where(eq(lifePlans.orgId, auth.orgId));
  }

  @Get('equity')
  async equity(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(equityGrants).where(eq(equityGrants.orgId, auth.orgId));
  }

  @Get('scenarios')
  async scenarios(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(scenarios).where(eq(scenarios.orgId, auth.orgId));
  }

  @Post('billing/checkout')
  @RequireRoles('owner')
  async checkout(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: { priceId: string }) {
    const auth = getAuth(req);
    return this.billing.createCheckoutSession(auth.orgId, body.priceId);
  }

  @Get('admin/orgs')
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

  @Post('verifications/reconcile')
  async reconcile(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.verificationSvc.runReconciliation(auth.orgId);
  }

  @Get('knowledge/search')
  async knowledgeSearch(@Query('q') q: string, @Query('domain') domain?: string) {
    return this.knowledge.search(q ?? '', domain);
  }

  @Get('feature-flags')
  async flags(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return {
      ai_agents: this.featureFlags.isEnabled('ai_agents', auth.orgId),
      monte_carlo: this.featureFlags.isEnabled('monte_carlo', auth.orgId),
      tax_center: this.featureFlags.isEnabled('tax_center', auth.orgId),
      advisor_portal: this.featureFlags.isEnabled('advisor_portal', auth.orgId),
    };
  }
}
