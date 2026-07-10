import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { eq, desc, inArray } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  transactions,
  financialGoals,
  budgets,
  investmentHoldings,
  investmentSecurities,
  liabilities,
  recurringStreams,
  lifePlans,
  equityGrants,
  scenarios,
  forecasts,
  budgetActuals,
  accounts,
  accountBalances,
} from '@pf/database';
import { simulateDebtPayoff, calculateFIRE, eventDrivenCashFlow, portfolioAllocation, runScenario, buildBillCalendar, type CashFlowScheduleItem } from '@pf/analytics';
import { getCashFlowFromData } from '@pf/sync';
import { AuthGuard, getAuth, RequireRoles } from '../../common/auth.guard';
import { AnalyticsService, PnlService, TaxService } from '../../services/analytics.services';
import { DATABASE } from '../../database.module';
import { CreateBudgetDto, CreateGoalDto } from '../../dto';

@ApiTags('analytics')
@Controller()
@ApiBearerAuth()
export class AnalyticsController {
  constructor(
    private analytics: AnalyticsService,
    private pnl: PnlService,
    private tax: TaxService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Get('net-worth')
  async netWorth(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const currency = await this.analytics.getUserCurrency(auth.userId);
    await this.analytics.computeDailySnapshot(auth.orgId);
    const current = await this.analytics.getNetWorth(auth.orgId, currency);
    const history = await this.analytics.getNetWorthHistory(auth.orgId);
    return { current, history, currency };
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

  @Post('pnl/:periodId/close')
  @RequireRoles('admin')
  async closePnl(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('periodId') periodId: string) {
    return this.pnl.closePeriod(getAuth(req).orgId, periodId);
  }

  @Get('budgets')
  async listBudgets(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(budgets).where(eq(budgets.orgId, auth.orgId));
  }

  @Post('budgets')
  @RequireRoles('admin')
  async createBudget(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: CreateBudgetDto) {
    const auth = getAuth(req);
    const [budget] = await this.db
      .insert(budgets)
      .values({
        orgId: auth.orgId,
        categoryId: body.categoryId,
        periodStart: body.periodStart,
        periodEnd: body.periodEnd,
        amount: body.amount.toString(),
      })
      .returning();
    return budget;
  }

  @Get('budgets/actuals')
  async budgetActuals(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db
      .select()
      .from(budgetActuals)
      .innerJoin(budgets, eq(budgets.id, budgetActuals.budgetId))
      .where(eq(budgets.orgId, auth.orgId));
  }

  @Get('investments/holdings')
  async holdings(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const rows = await this.db
      .select()
      .from(investmentHoldings)
      .where(eq(investmentHoldings.orgId, auth.orgId));
    const securities = await this.db.select().from(investmentSecurities);
    return rows.map((h) => {
      const sec = securities.find((s) => s.id === h.securityId);
      return {
        ...h,
        securityName: sec?.name,
        ticker: sec?.ticker,
        securityType: sec?.type,
      };
    });
  }

  @Get('investments/allocation')
  async allocation(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const nw = await this.analytics.getNetWorth(auth.orgId);
    const rows = await this.db
      .select()
      .from(investmentHoldings)
      .where(eq(investmentHoldings.orgId, auth.orgId));
    const securities = await this.db.select().from(investmentSecurities);
    const holdings = rows.map((h) => {
      const sec = securities.find((s) => s.id === h.securityId);
      return {
        id: h.id,
        securityName: sec?.name ?? undefined,
        securityType: sec?.type ?? undefined,
        ticker: sec?.ticker ?? undefined,
        institutionValue: parseFloat(h.institutionValue ?? '0'),
      };
    });
    return portfolioAllocation(holdings, nw.cash);
  }

  @Get('calendar/bills')
  async billCalendar(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const recurring = await this.db
      .select()
      .from(recurringStreams)
      .where(eq(recurringStreams.orgId, auth.orgId));
    const liabilityRows = await this.db
      .select()
      .from(liabilities)
      .where(eq(liabilities.orgId, auth.orgId));

    const events = buildBillCalendar(
      recurring.map((r) => ({
        id: r.id,
        description: r.description ?? undefined,
        averageAmount: parseFloat(r.averageAmount ?? '0'),
        frequency: r.frequency ?? undefined,
        lastDate: r.lastDate ?? undefined,
        isActive: r.isActive,
      })),
      liabilityRows.map((l) => ({
        id: l.id,
        liabilityType: l.liabilityType ?? undefined,
        minimumPayment: parseFloat(l.minimumPayment ?? '0'),
        nextPaymentDue: l.nextPaymentDue ?? undefined,
      })),
    );

    const totalDue = events.reduce((s, e) => s + e.amount, 0);
    return { events, totalDue, days: 30 };
  }

  @Get('liabilities')
  async listLiabilities(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const rows = await this.db.select().from(liabilities).where(eq(liabilities.orgId, auth.orgId));
    if (rows.length === 0) return [];

    const accountIds = [...new Set(rows.map((r) => r.accountId))];
    const accts = await this.db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(inArray(accounts.id, accountIds));
    const acctById = new Map(accts.map((a) => [a.id, a]));

    const balances = await Promise.all(
      accountIds.map(async (accountId) => {
        const [bal] = await this.db
          .select({ current: accountBalances.current })
          .from(accountBalances)
          .where(eq(accountBalances.accountId, accountId))
          .orderBy(desc(accountBalances.capturedAt))
          .limit(1);
        return [accountId, bal?.current ?? null] as const;
      }),
    );
    const balById = new Map(balances);

    return rows.map((row) => ({
      ...row,
      accountName: acctById.get(row.accountId)?.name ?? row.liabilityType ?? 'Debt',
      balance: balById.get(row.accountId) ?? null,
    }));
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
  async createGoal(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: CreateGoalDto) {
    const auth = getAuth(req);
    const [goal] = await this.db
      .insert(financialGoals)
      .values({
        orgId: auth.orgId,
        name: body.name,
        goalType: (body.goalType as 'custom') ?? 'custom',
        targetAmount: body.targetAmount?.toString(),
        targetDate: body.targetDate,
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
    const streams = await this.db
      .select()
      .from(recurringStreams)
      .where(eq(recurringStreams.orgId, auth.orgId));
    const orgLiabilities = await this.db
      .select()
      .from(liabilities)
      .where(eq(liabilities.orgId, auth.orgId));

    const schedule: CashFlowScheduleItem[] = [];

    for (const stream of streams) {
      if (!stream.isActive) continue;
      const amount = parseFloat(stream.averageAmount ?? stream.lastAmount ?? '0');
      if (!amount) continue;
      const freq = (stream.frequency?.toLowerCase() ?? 'monthly') as CashFlowScheduleItem['frequency'];
      schedule.push({
        amount,
        frequency: freq === 'weekly' || freq === 'biweekly' || freq === 'annually' ? freq : 'monthly',
        type: amount < 0 ? 'income' : 'expense',
        label: stream.description ?? undefined,
      });
    }

    for (const liability of orgLiabilities) {
      const payment = parseFloat(liability.minimumPayment ?? '0');
      if (!payment) continue;
      schedule.push({
        amount: payment,
        frequency: 'monthly',
        type: 'expense',
        label: liability.liabilityType ?? 'debt payment',
      });
    }

    const { series, model } = eventDrivenCashFlow(36, nw.netWorth, schedule);
    const [forecast] = await this.db
      .insert(forecasts)
      .values({
        orgId: auth.orgId,
        forecastType: 'cash_flow',
        horizonMonths: 36,
        seriesJson: { series, model },
      })
      .returning();
    return { forecast, series, model };
  }

  @Get('health-score')
  async healthScore(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.analytics.computeHealthScore(auth.orgId);
  }

  @Get('health-score/history')
  async healthHistory(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.analytics.getHealthScoreHistory(getAuth(req).orgId);
  }

  @Get('taxes/estimate')
  async taxEstimate(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Query('year') year?: string,
  ) {
    const auth = getAuth(req);
    const taxYear = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.tax.estimate(auth.orgId, taxYear);
  }

  @Get('taxes/profile')
  async taxProfile(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    return this.tax.getProfile(getAuth(req).orgId);
  }

  @Put('taxes/profile')
  @RequireRoles('admin')
  async updateTaxProfile(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    return this.tax.upsertProfile(getAuth(req).orgId, body);
  }

  @Post('debt/simulate')
  async debtSimulate(
    @Body()
    body: {
      debts: Array<{ name: string; balance: number; interestRate: number; minimumPayment: number }>;
      extraPayment: number;
      strategy: 'avalanche' | 'snowball';
    },
  ) {
    return simulateDebtPayoff(body.debts, body.extraPayment, body.strategy);
  }

  @Get('fire')
  async fire(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const nw = await this.analytics.getNetWorth(auth.orgId);
    const cf = await getCashFlowFromData(this.db, auth.orgId);
    const annualExpenses = cf.monthlyExpenses * 12;
    const annualSavings = (cf.monthlyIncome - cf.monthlyExpenses) * 12;
    return calculateFIRE(annualExpenses || 60000, nw.netWorth, annualSavings || 12000);
  }

  @Get('scenarios')
  async scenarios(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(scenarios).where(eq(scenarios.orgId, auth.orgId));
  }

  @Post('scenarios')
  async createScenario(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [scenario] = await this.db
      .insert(scenarios)
      .values({
        orgId: auth.orgId,
        name: body.name as string,
        scenarioType: (body.scenarioType as 'what_if') ?? 'what_if',
        inputsJson: body.inputs as Record<string, unknown>,
        createdBy: auth.userId,
      })
      .returning();
    return scenario;
  }

  @Post('scenarios/:id/run')
  async runScenarioSimulation(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
  ) {
    const auth = getAuth(req);
    const [scenario] = await this.db
      .select()
      .from(scenarios)
      .where(eq(scenarios.id, id))
      .limit(1);

    if (!scenario || scenario.orgId !== auth.orgId) {
      throw new Error('Scenario not found');
    }

    const inputs = scenario.inputsJson as Record<string, unknown>;
    const nw = await this.analytics.getNetWorth(auth.orgId);
    const cf = await getCashFlowFromData(this.db, auth.orgId);

    const result = runScenario({
      name: scenario.name,
      startingBalance: (inputs.startingBalance as number) ?? nw.netWorth,
      monthlyIncome: (inputs.monthlyIncome as number) ?? cf.monthlyIncome,
      monthlyExpenses: (inputs.monthlyExpenses as number) ?? cf.monthlyExpenses,
      months: (inputs.months as number) ?? 12,
      incomeChangePct: inputs.incomeChangePct as number | undefined,
      expenseChangePct: inputs.expenseChangePct as number | undefined,
      oneTimeExpense: inputs.oneTimeExpense as number | undefined,
      oneTimeExpenseMonth: inputs.oneTimeExpenseMonth as number | undefined,
    });

    const [updated] = await this.db
      .update(scenarios)
      .set({ resultsJson: result as unknown as Record<string, unknown> })
      .where(eq(scenarios.id, id))
      .returning();

    return { scenario: updated, result };
  }

  @Get('life-plans')
  async lifePlans(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(lifePlans).where(eq(lifePlans.orgId, auth.orgId));
  }

  @Post('life-plans')
  async createLifePlan(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [plan] = await this.db
      .insert(lifePlans)
      .values({
        orgId: auth.orgId,
        planType: (body.planType as 'custom') ?? 'custom',
        name: body.name as string,
        targetDate: body.targetDate as string,
        inputsJson: body.inputs as Record<string, unknown>,
      })
      .returning();
    return plan;
  }

  @Get('equity')
  async equity(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(equityGrants).where(eq(equityGrants.orgId, auth.orgId));
  }

  @Post('equity')
  async createEquityGrant(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const [grant] = await this.db
      .insert(equityGrants)
      .values({
        orgId: auth.orgId,
        grantType: (body.grantType as 'rsu') ?? 'rsu',
        companyName: body.companyName as string,
        ticker: body.ticker as string,
        grantDate: body.grantDate as string,
        totalShares: body.totalShares?.toString(),
        vestedShares: body.vestedShares?.toString(),
        strikePrice: body.strikePrice?.toString(),
        currentFmv: body.currentFmv?.toString(),
      })
      .returning();
    return grant;
  }
}
