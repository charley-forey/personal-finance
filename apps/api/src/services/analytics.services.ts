import { Injectable, Inject } from '@nestjs/common';
import { eq, desc, and, gte } from 'drizzle-orm';
import {
  accounts,
  accountBalances,
  transactions,
  dailyOrgSnapshots,
  changeEvents,
  categories,
  categoryGroups,
  pnlTemplates,
  pnlPeriods,
  pnlCells,
  budgets,
  financialGoals,
  scenarios,
  forecasts,
  insights,
  notifications,
  verifications,
  investmentHoldings,
  investmentSecurities,
  liabilities,
  recurringStreams,
  manualAssets,
  documents,
  taxProfiles,
  healthScores,
  automationRules,
  agentConversations,
  lifePlans,
  equityGrants,
  userPreferences,
  plaidItems,
} from '@pf/database';
import { DATABASE } from '../database.module';
import type { Database } from '@pf/database';
import {
  runMonteCarlo,
  estimateTax,
  simulateDebtPayoff,
  calculateHealthScore,
  calculateFIRE,
  forecastCashFlow,
} from '@pf/analytics';
import {
  createOpenAIClient,
  generateInsight,
  chatWithTools,
  generateEmbedding,
  type AgentType,
  type AgentToolName,
  type ToolHandler,
} from '@pf/ai';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PNL_ROWS, DEFAULT_PNL_COLUMNS, parseDecimal } from '@pf/shared';
import { getNetWorth as syncGetNetWorth, computeDailySnapshot as syncComputeSnapshot, getCashFlowFromData, populatePnlActuals, computeBudgetActuals } from '@pf/sync';
import { searchKnowledge } from '@pf/sync';
import { EVENT_TYPES } from '@pf/events';
import { agentMemories, agentRuns, budgetActuals, domainEvents } from '@pf/database';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
  ) {}

  async getUserCurrency(userId: string): Promise<string> {
    const [prefs] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    return prefs?.currency ?? 'USD';
  }

  async getNetWorth(orgId: string, targetCurrency = 'USD') {
    return syncGetNetWorth(this.db, orgId, targetCurrency);
  }

  async computeDailySnapshot(orgId: string) {
    return syncComputeSnapshot(this.db, orgId);
  }

  async getNetWorthHistory(orgId: string, days = 90) {
    const start = new Date();
    start.setDate(start.getDate() - days);
    return this.db
      .select()
      .from(dailyOrgSnapshots)
      .where(
        and(
          eq(dailyOrgSnapshots.orgId, orgId),
          gte(dailyOrgSnapshots.snapshotDate, start.toISOString().split('T')[0]!),
        ),
      )
      .orderBy(dailyOrgSnapshots.snapshotDate);
  }

  async runMonteCarloSimulation(orgId: string, inputs: Record<string, unknown>) {
    const nw = await this.getNetWorth(orgId);
    const result = runMonteCarlo({
      currentPortfolio: nw.netWorth,
      monthlyContribution: (inputs.monthlyContribution as number) ?? 1000,
      monthlyWithdrawal: (inputs.monthlyWithdrawal as number) ?? 4000,
      yearsToSimulate: (inputs.years as number) ?? 30,
      assetAllocation: { stocks: 0.7, bonds: 0.25, cash: 0.05 },
      assumptions: {
        stockReturnMean: 0.07,
        stockReturnStd: 0.15,
        bondReturnMean: 0.03,
        bondReturnStd: 0.05,
        inflationMean: 0.025,
        inflationStd: 0.01,
      },
      numSimulations: 1000,
    });

    const [scenario] = await this.db
      .insert(scenarios)
      .values({
        orgId,
        name: (inputs.name as string) ?? 'Retirement Simulation',
        scenarioType: 'monte_carlo',
        inputsJson: inputs,
        resultsJson: result as unknown as Record<string, unknown>,
      })
      .returning();

    return { scenario, result };
  }

  private async computeAllocationDrift(orgId: string, nw: Awaited<ReturnType<typeof syncGetNetWorth>>) {
    const target = { equity: 0.6, fixedIncome: 0.25, cash: 0.15 };
    const { getLatestHoldings } = await import('@pf/sync');
    const holdings = await getLatestHoldings(this.db, orgId);
    const securities = await this.db.select().from(investmentSecurities);

    let equity = 0;
    let fixedIncome = 0;
    for (const h of holdings) {
      const val = parseDecimal(h.institutionValue);
      const sec = securities.find((s) => s.id === h.securityId);
      const type = sec?.type?.toLowerCase() ?? '';
      if (type.includes('bond') || type.includes('fixed')) {
        fixedIncome += val;
      } else {
        equity += val;
      }
    }

    if (equity === 0 && fixedIncome === 0) {
      equity = nw.investments;
    }

    const total = equity + fixedIncome + nw.cash;
    if (total <= 0) return 0;

    const actual = {
      equity: equity / total,
      fixedIncome: fixedIncome / total,
      cash: nw.cash / total,
    };

    return (
      (Math.abs(actual.equity - target.equity) +
        Math.abs(actual.fixedIncome - target.fixedIncome) +
        Math.abs(actual.cash - target.cash)) *
      100
    );
  }

  private async computeGoalProgress(orgId: string) {
    const goals = await this.db.select().from(financialGoals).where(eq(financialGoals.orgId, orgId));
    if (goals.length === 0) return 0.5;

    const progresses = goals.map((g) => {
      const target = parseDecimal(g.targetAmount);
      const current = parseDecimal(g.currentAmount);
      return target > 0 ? Math.min(1, current / target) : 0;
    });
    return progresses.reduce((a, b) => a + b, 0) / progresses.length;
  }

  private async computeIncomeVolatility(orgId: string) {
    const txns = await this.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.orgId, orgId), eq(transactions.isDeleted, false)));

    const monthlyIncome = new Map<string, number>();
    for (const t of txns) {
      const amt = parseDecimal(t.amount);
      if (amt < 0) {
        const month = t.date.slice(0, 7);
        monthlyIncome.set(month, (monthlyIncome.get(month) ?? 0) + Math.abs(amt));
      }
    }

    const values = [...monthlyIncome.values()];
    if (values.length < 2) return 0.1;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const std = Math.sqrt(variance);
    return mean > 0 ? Math.min(1, std / mean) : 0.1;
  }

  private async computeDataFreshness(orgId: string) {
    const items = await this.db.select().from(plaidItems).where(eq(plaidItems.orgId, orgId));
    if (items.length === 0) return 0.5;

    const now = Date.now();
    const scores = items.map((item) => {
      if (!item.lastSyncedAt) return 0.3;
      const hoursSince = (now - item.lastSyncedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 24) return 1;
      if (hoursSince < 72) return 0.8;
      if (hoursSince < 168) return 0.5;
      return 0.2;
    });
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  async computeHealthScore(orgId: string) {
    const nw = await this.getNetWorth(orgId);
    const cf = await getCashFlowFromData(this.db, orgId);
    await computeBudgetActuals(this.db, orgId);

    const actuals = await this.db
      .select()
      .from(budgetActuals)
      .innerJoin(budgets, eq(budgets.id, budgetActuals.budgetId))
      .where(eq(budgets.orgId, orgId));

    let budgetAdherence = 0.8;
    if (actuals.length > 0) {
      const onTrack = actuals.filter((a) => parseDecimal(a.budget_actuals.remaining) >= 0).length;
      budgetAdherence = onTrack / actuals.length;
    }

    const [allocationDrift, goalProgress, incomeVolatility, dataFreshness] = await Promise.all([
      this.computeAllocationDrift(orgId, nw),
      this.computeGoalProgress(orgId),
      this.computeIncomeVolatility(orgId),
      this.computeDataFreshness(orgId),
    ]);

    const score = calculateHealthScore({
      emergencyFundMonths: nw.cash / Math.max(cf.monthlyExpenses, 1),
      dti: nw.totalLiabilities / Math.max(nw.totalAssets, 1),
      savingsRate: cf.savingsRate,
      allocationDrift,
      incomeVolatility,
      goalProgress,
      dataFreshness,
      budgetAdherence,
    });

    await this.db.insert(healthScores).values({
      orgId,
      overallScore: score.overall,
      subScoresJson: score.subScores,
      improvementActionsJson: score.actions,
    });

    return score;
  }

  async generateAiInsight(orgId: string) {
    const nw = await this.getNetWorth(orgId);
    const apiKey = this.config.get('OPENAI_API_KEY');
    if (!apiKey || apiKey.includes('1234567890')) {
      const insight = {
        title: 'Welcome to Personal Finance OS',
        body: 'Link your accounts to start receiving personalized insights about your finances.',
        type: 'opportunity' as const,
      };
      await this.db.insert(insights).values({
        orgId,
        insightType: 'opportunity',
        title: insight.title,
        body: insight.body,
      });
      return insight;
    }

    const client = createOpenAIClient(apiKey);
    const result = await generateInsight(client, {
      netWorth: nw.netWorth,
      savingsRate: 0.15,
      recentChanges: ['Account linked', 'Initial sync completed'],
    });

    await this.db.insert(insights).values({
      orgId,
      insightType: result.type as 'anomaly',
      title: result.title,
      body: result.body,
      aiModel: 'gpt-4o-mini',
    });

    return result;
  }

  async chatAgent(orgId: string, userId: string, agentType: AgentType, message: string, conversationId?: string) {
    const nw = await this.getNetWorth(orgId);
    const cf = await getCashFlowFromData(this.db, orgId);
    const memories = await this.db
      .select()
      .from(agentMemories)
      .where(and(eq(agentMemories.orgId, orgId), eq(agentMemories.userId, userId)))
      .limit(5);

    const apiKey = this.config.get('OPENAI_API_KEY', '');
    const client = createOpenAIClient(apiKey);
    const embedFn = apiKey
      ? async (text: string) => generateEmbedding(client, text)
      : undefined;

    const context = [
      `Net worth: $${nw.netWorth.toFixed(2)}, Assets: $${nw.totalAssets.toFixed(2)}, Liabilities: $${nw.totalLiabilities.toFixed(2)}`,
      `Monthly income: $${cf.monthlyIncome.toFixed(0)}, expenses: $${cf.monthlyExpenses.toFixed(0)}, savings rate: ${(cf.savingsRate * 100).toFixed(1)}%`,
      memories.length ? `User preferences: ${memories.map((m) => m.content).join('; ')}` : '',
    ].filter(Boolean).join('\n');

    const toolHandlers: Partial<Record<AgentToolName, ToolHandler>> = {
      get_net_worth: async () => this.getNetWorth(orgId),
      get_cash_flow: async () => getCashFlowFromData(this.db, orgId),
      run_monte_carlo: async (args) => {
        const result = runMonteCarlo({
          currentPortfolio: nw.netWorth,
          monthlyContribution: (args.monthlyContribution as number) ?? 1000,
          monthlyWithdrawal: (args.monthlyWithdrawal as number) ?? 4000,
          yearsToSimulate: (args.years as number) ?? 30,
          assetAllocation: { stocks: 0.7, bonds: 0.25, cash: 0.05 },
          assumptions: {
            stockReturnMean: 0.07,
            stockReturnStd: 0.15,
            bondReturnMean: 0.03,
            bondReturnStd: 0.05,
            inflationMean: 0.025,
            inflationStd: 0.01,
          },
          numSimulations: 1000,
        });
        return result;
      },
      simulate_debt: async (args) => {
        const strategy = (args.strategy as 'avalanche' | 'snowball') ?? 'avalanche';
        const extraPayment = (args.extraPayment as number) ?? 0;
        const accts = await this.db.select().from(accounts).where(eq(accounts.orgId, orgId));
        const liabs = await this.db.select().from(liabilities).where(eq(liabilities.orgId, orgId));
        const debts = [];
        for (const liab of liabs) {
          const acct = accts.find((a) => a.id === liab.accountId);
          const [bal] = await this.db
            .select()
            .from(accountBalances)
            .where(eq(accountBalances.accountId, liab.accountId))
            .orderBy(desc(accountBalances.capturedAt))
            .limit(1);
          debts.push({
            name: acct?.name ?? 'Debt',
            balance: Math.abs(parseDecimal(bal?.current)),
            interestRate: parseDecimal(liab.apr) / 100,
            minimumPayment: parseDecimal(liab.minimumPayment),
          });
        }
        if (debts.length === 0) return { error: 'No liabilities found' };
        return simulateDebtPayoff(debts, extraPayment, strategy);
      },
      search_knowledge: async (args) => {
        const results = await searchKnowledge(
          this.db,
          (args.query as string) ?? message,
          args.domain as string | undefined,
          embedFn,
        );
        return results;
      },
    };

    let conversation;
    let history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

    if (conversationId) {
      const [existing] = await this.db
        .select()
        .from(agentConversations)
        .where(and(eq(agentConversations.id, conversationId), eq(agentConversations.orgId, orgId)))
        .limit(1);
      conversation = existing;
      history = (existing?.messagesJson ?? []) as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    }

    history.push({ role: 'user', content: message });

    const start = Date.now();
    const response = await chatWithTools(client, agentType, history, context, toolHandlers);
    const latencyMs = Date.now() - start;

    history.push({ role: 'assistant', content: response.content });

    if (conversation) {
      await this.db
        .update(agentConversations)
        .set({ messagesJson: history })
        .where(eq(agentConversations.id, conversation.id));
    } else {
      const [created] = await this.db
        .insert(agentConversations)
        .values({ orgId, userId, agentType, messagesJson: history })
        .returning();
      conversation = created;
    }

    await this.db.insert(agentRuns).values({
      conversationId: conversation!.id,
      toolCallsJson: response.toolCalls,
      tokensUsed: response.tokensUsed,
      latencyMs,
    });

    return { conversationId: conversation!.id, response: response.content, toolCalls: response.toolCalls };
  }

  async getAgentConversations(orgId: string, userId: string, limit = 50) {
    return this.db
      .select({
        id: agentConversations.id,
        agentType: agentConversations.agentType,
        messagesJson: agentConversations.messagesJson,
        createdAt: agentConversations.createdAt,
      })
      .from(agentConversations)
      .where(and(eq(agentConversations.orgId, orgId), eq(agentConversations.userId, userId)))
      .orderBy(desc(agentConversations.createdAt))
      .limit(limit);
  }

  async getHealthScoreHistory(orgId: string, limit = 30) {
    return this.db
      .select()
      .from(healthScores)
      .where(eq(healthScores.orgId, orgId))
      .orderBy(desc(healthScores.computedAt))
      .limit(limit);
  }

  async getActivityFeed(orgId: string, limit = 20) {
    return this.db
      .select()
      .from(changeEvents)
      .where(eq(changeEvents.orgId, orgId))
      .orderBy(desc(changeEvents.detectedAt))
      .limit(limit);
  }
}

@Injectable()
export class PnlService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async getOrCreateTemplate(orgId: string) {
    const [existing] = await this.db
      .select()
      .from(pnlTemplates)
      .where(eq(pnlTemplates.orgId, orgId))
      .limit(1);

    if (existing) return existing;

    const [template] = await this.db
      .insert(pnlTemplates)
      .values({
        orgId,
        name: 'Monthly P&L',
        structureJson: { rows: DEFAULT_PNL_ROWS, columns: DEFAULT_PNL_COLUMNS },
      })
      .returning();

    return template!;
  }

  async getPeriod(orgId: string, year: number, month: number) {
    let [period] = await this.db
      .select()
      .from(pnlPeriods)
      .where(
        and(eq(pnlPeriods.orgId, orgId), eq(pnlPeriods.year, year), eq(pnlPeriods.month, month)),
      )
      .limit(1);

    if (!period) {
      const template = await this.getOrCreateTemplate(orgId);
      [period] = await this.db
        .insert(pnlPeriods)
        .values({ orgId, templateId: template.id, year, month })
        .returning();
    }

    const cells = await this.db
      .select()
      .from(pnlCells)
      .where(eq(pnlCells.periodId, period!.id));

    if (period!.status === 'draft') {
      await populatePnlActuals(this.db, orgId, period!.id, year, month);
    }

    const updatedCells = await this.db
      .select()
      .from(pnlCells)
      .where(eq(pnlCells.periodId, period!.id));

    const template = await this.getOrCreateTemplate(orgId);
    return { period, cells: updatedCells, structure: template.structureJson };
  }

  async closePeriod(orgId: string, periodId: string) {
    const [period] = await this.db
      .select()
      .from(pnlPeriods)
      .where(and(eq(pnlPeriods.id, periodId), eq(pnlPeriods.orgId, orgId)))
      .limit(1);

    if (!period) throw new Error('Period not found');

    const [updated] = await this.db
      .update(pnlPeriods)
      .set({ status: 'closed' })
      .where(and(eq(pnlPeriods.id, periodId), eq(pnlPeriods.orgId, orgId)))
      .returning();

    await this.db.insert(domainEvents).values({
      orgId,
      eventType: EVENT_TYPES.PNL_PERIOD_CLOSED,
      aggregateType: 'pnl_period',
      aggregateId: periodId,
      payloadJson: { year: period.year, month: period.month },
    });

    return updated;
  }

  async updateCell(orgId: string, periodId: string, rowKey: string, columnKey: string, value: number) {
    const [period] = await this.db
      .select({ id: pnlPeriods.id })
      .from(pnlPeriods)
      .where(and(eq(pnlPeriods.id, periodId), eq(pnlPeriods.orgId, orgId)))
      .limit(1);

    if (!period) throw new Error('Period not found');

    const existing = await this.db
      .select()
      .from(pnlCells)
      .where(
        and(
          eq(pnlCells.periodId, periodId),
          eq(pnlCells.rowKey, rowKey),
          eq(pnlCells.columnKey, columnKey),
        ),
      )
      .limit(1);

    if (existing[0]) {
      const [cell] = await this.db
        .update(pnlCells)
        .set({ value: value.toString() })
        .where(eq(pnlCells.id, existing[0].id))
        .returning();
      return cell;
    }

    const [cell] = await this.db
      .insert(pnlCells)
      .values({
        periodId,
        rowKey,
        columnKey,
        value: value.toString(),
        source: 'manual',
      })
      .returning();

    return cell;
  }
}

@Injectable()
export class TaxService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async upsertProfile(orgId: string, data: Record<string, unknown>) {
    const [existing] = await this.db.select().from(taxProfiles).where(eq(taxProfiles.orgId, orgId)).limit(1);
    if (existing) {
      const [updated] = await this.db
        .update(taxProfiles)
        .set({
          filingStatus: (data.filingStatus as string) ?? existing.filingStatus,
          state: (data.state as string) ?? existing.state,
          dependents: (data.dependents as number) ?? existing.dependents,
          estimatedAnnualIncome: data.estimatedAnnualIncome?.toString() ?? existing.estimatedAnnualIncome,
          withholdingYtd: data.withholdingYtd?.toString() ?? existing.withholdingYtd,
        })
        .where(eq(taxProfiles.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(taxProfiles)
      .values({
        orgId,
        filingStatus: data.filingStatus as string,
        state: data.state as string,
        dependents: (data.dependents as number) ?? 0,
        estimatedAnnualIncome: data.estimatedAnnualIncome?.toString(),
        withholdingYtd: data.withholdingYtd?.toString(),
      })
      .returning();
    return created;
  }

  async getProfile(orgId: string) {
    const [profile] = await this.db.select().from(taxProfiles).where(eq(taxProfiles.orgId, orgId)).limit(1);
    return profile ?? null;
  }

  async estimate(orgId: string, taxYear = new Date().getFullYear()) {
    const profile = await this.getProfile(orgId);
    const estimate = estimateTax({
      taxYear,
      filingStatus: (profile?.filingStatus as 'single') ?? 'single',
      state: profile?.state ?? 'NY',
      w2Income: parseDecimal(profile?.estimatedAnnualIncome),
      selfEmploymentIncome: 0,
      investmentIncome: { dividends: 0, longTermGains: 0, shortTermGains: 0 },
      deductions: { standard: true, itemized: 0, hsa: 0, retirement401k: 0 },
      withholdingYtd: parseDecimal(profile?.withholdingYtd),
      estimatedPaymentsYtd: 0,
    });

    const quarterlyAmount = estimate.quarterlyPayment;
    const year = taxYear;
    const quarterlyPayments = [
      { quarter: 'Q1', dueDate: `${year}-04-15`, amount: quarterlyAmount },
      { quarter: 'Q2', dueDate: `${year}-06-15`, amount: quarterlyAmount },
      { quarter: 'Q3', dueDate: `${year}-09-15`, amount: quarterlyAmount },
      { quarter: 'Q4', dueDate: `${year + 1}-01-15`, amount: quarterlyAmount },
    ];

    return { ...estimate, taxYear, quarterlyPayments };
  }
}
