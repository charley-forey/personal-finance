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
import { createOpenAIClient, generateInsight, chatWithAgent, type AgentType } from '@pf/ai';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PNL_ROWS, DEFAULT_PNL_COLUMNS, parseDecimal } from '@pf/shared';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private config: ConfigService,
  ) {}

  async getNetWorth(orgId: string) {
    const accts = await this.db.select().from(accounts).where(eq(accounts.orgId, orgId));
    let totalAssets = 0;
    let totalLiabilities = 0;

    for (const acct of accts) {
      const [balance] = await this.db
        .select()
        .from(accountBalances)
        .where(eq(accountBalances.accountId, acct.id))
        .orderBy(desc(accountBalances.capturedAt))
        .limit(1);

      const current = parseDecimal(balance?.current);
      if (['credit', 'loan'].includes(acct.type)) {
        totalLiabilities += Math.abs(current);
      } else {
        totalAssets += current;
      }
    }

    const assets = await this.db.select().from(manualAssets).where(eq(manualAssets.orgId, orgId));
    for (const a of assets) {
      totalAssets += parseDecimal(a.currentValue);
    }

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    };
  }

  async computeDailySnapshot(orgId: string) {
    const nw = await this.getNetWorth(orgId);
    const today = new Date().toISOString().split('T')[0]!;

    const monthStart = `${today.slice(0, 7)}-01`;
    const txns = await this.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.orgId, orgId), gte(transactions.date, monthStart)));

    let incomeMtd = 0;
    let expensesMtd = 0;
    for (const t of txns) {
      const amt = parseDecimal(t.amount);
      if (amt < 0) incomeMtd += Math.abs(amt);
      else expensesMtd += amt;
    }

    await this.db
      .insert(dailyOrgSnapshots)
      .values({
        orgId,
        snapshotDate: today,
        totalAssets: nw.totalAssets.toString(),
        totalLiabilities: nw.totalLiabilities.toString(),
        netWorth: nw.netWorth.toString(),
        incomeMtd: incomeMtd.toString(),
        expensesMtd: expensesMtd.toString(),
        savingsMtd: (incomeMtd - expensesMtd).toString(),
      })
      .onConflictDoUpdate({
        target: [dailyOrgSnapshots.orgId, dailyOrgSnapshots.snapshotDate],
        set: {
          totalAssets: nw.totalAssets.toString(),
          totalLiabilities: nw.totalLiabilities.toString(),
          netWorth: nw.netWorth.toString(),
          incomeMtd: incomeMtd.toString(),
          expensesMtd: expensesMtd.toString(),
          savingsMtd: (incomeMtd - expensesMtd).toString(),
          computedAt: new Date(),
        },
      });

    return nw;
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

  async computeHealthScore(orgId: string) {
    const nw = await this.getNetWorth(orgId);
    const txns = await this.db.select().from(transactions).where(eq(transactions.orgId, orgId)).limit(500);

    let income = 0;
    let expenses = 0;
    for (const t of txns) {
      const amt = parseDecimal(t.amount);
      if (amt < 0) income += Math.abs(amt);
      else expenses += amt;
    }

    const score = calculateHealthScore({
      emergencyFundMonths: nw.totalAssets / Math.max(expenses / 12, 1),
      dti: nw.totalLiabilities / Math.max(nw.totalAssets, 1),
      savingsRate: income > 0 ? (income - expenses) / income : 0,
      allocationDrift: 5,
      incomeVolatility: 0.1,
      goalProgress: 0.5,
      dataFreshness: 1,
      budgetAdherence: 0.8,
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

  async chatAgent(orgId: string, userId: string, agentType: AgentType, message: string) {
    const nw = await this.getNetWorth(orgId);
    const context = `Net worth: $${nw.netWorth.toFixed(2)}, Assets: $${nw.totalAssets.toFixed(2)}, Liabilities: $${nw.totalLiabilities.toFixed(2)}`;

    const apiKey = this.config.get('OPENAI_API_KEY', '');
    const client = createOpenAIClient(apiKey);

    const [conversation] = await this.db
      .insert(agentConversations)
      .values({
        orgId,
        userId,
        agentType,
        messagesJson: [{ role: 'user', content: message }],
      })
      .returning();

    const response = await chatWithAgent(
      client,
      agentType,
      [{ role: 'user', content: message }],
      context,
    );

    return { conversationId: conversation!.id, response: response.content };
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

    const template = await this.getOrCreateTemplate(orgId);
    return { period, cells, structure: template.structureJson };
  }

  async updateCell(periodId: string, rowKey: string, columnKey: string, value: number) {
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

  async estimate(orgId: string) {
    const [profile] = await this.db
      .select()
      .from(taxProfiles)
      .where(eq(taxProfiles.orgId, orgId))
      .limit(1);

    return estimateTax({
      taxYear: 2024,
      filingStatus: (profile?.filingStatus as 'single') ?? 'single',
      state: profile?.state ?? 'NY',
      w2Income: parseDecimal(profile?.estimatedAnnualIncome),
      selfEmploymentIncome: 0,
      investmentIncome: { dividends: 0, longTermGains: 0, shortTermGains: 0 },
      deductions: { standard: true, itemized: 0, hsa: 0, retirement401k: 0 },
      withholdingYtd: parseDecimal(profile?.withholdingYtd),
      estimatedPaymentsYtd: 0,
    });
  }
}
