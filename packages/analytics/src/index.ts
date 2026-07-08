export interface MonteCarloInput {
  currentPortfolio: number;
  monthlyContribution: number;
  monthlyWithdrawal: number;
  yearsToSimulate: number;
  assetAllocation: { stocks: number; bonds: number; cash: number };
  assumptions: {
    stockReturnMean: number;
    stockReturnStd: number;
    bondReturnMean: number;
    bondReturnStd: number;
    inflationMean: number;
    inflationStd: number;
  };
  retirementYear?: number;
  socialSecurityMonthly?: number;
  numSimulations: number;
}

export interface MonteCarloOutput {
  successRate: number;
  medianEndingBalance: number;
  percentiles: {
    p5: number[];
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
    p95: number[];
  };
  worstCase: number;
  bestCase: number;
}

function randomNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

export function runMonteCarlo(input: MonteCarloInput): MonteCarloOutput {
  const months = input.yearsToSimulate * 12;
  const endingBalances: number[] = [];
  const yearlyPaths: number[][] = Array.from({ length: input.numSimulations }, () => []);

  for (let sim = 0; sim < input.numSimulations; sim++) {
    let portfolio = input.currentPortfolio;
    for (let m = 0; m < months; m++) {
      const year = Math.floor(m / 12);
      const isRetired = input.retirementYear !== undefined && year >= input.retirementYear;

      const stockReturn = randomNormal(
        input.assumptions.stockReturnMean / 12,
        input.assumptions.stockReturnStd / Math.sqrt(12),
      );
      const bondReturn = randomNormal(
        input.assumptions.bondReturnMean / 12,
        input.assumptions.bondReturnStd / Math.sqrt(12),
      );
      const portfolioReturn =
        input.assetAllocation.stocks * stockReturn +
        input.assetAllocation.bonds * bondReturn +
        input.assetAllocation.cash * (input.assumptions.inflationMean / 12);

      portfolio *= 1 + portfolioReturn;
      portfolio += isRetired ? -input.monthlyWithdrawal : input.monthlyContribution;
      if (isRetired && input.socialSecurityMonthly) {
        portfolio += input.socialSecurityMonthly;
      }
      portfolio = Math.max(0, portfolio);

      if (m % 12 === 11) {
        yearlyPaths[sim].push(portfolio);
      }
    }
    endingBalances.push(portfolio);
  }

  endingBalances.sort((a, b) => a - b);
  const successRate =
    (endingBalances.filter((b) => b > 0).length / input.numSimulations) * 100;

  const percentile = (paths: number[][], p: number): number[] => {
    const result: number[] = [];
    for (let y = 0; y < input.yearsToSimulate; y++) {
      const values = paths.map((path) => path[y] ?? 0).sort((a, b) => a - b);
      result.push(values[Math.floor(values.length * p)] ?? 0);
    }
    return result;
  };

  return {
    successRate,
    medianEndingBalance: endingBalances[Math.floor(endingBalances.length / 2)] ?? 0,
    percentiles: {
      p5: percentile(yearlyPaths, 0.05),
      p10: percentile(yearlyPaths, 0.1),
      p25: percentile(yearlyPaths, 0.25),
      p50: percentile(yearlyPaths, 0.5),
      p75: percentile(yearlyPaths, 0.75),
      p90: percentile(yearlyPaths, 0.9),
      p95: percentile(yearlyPaths, 0.95),
    },
    worstCase: endingBalances[Math.floor(endingBalances.length * 0.05)] ?? 0,
    bestCase: endingBalances[Math.floor(endingBalances.length * 0.95)] ?? 0,
  };
}

export interface TaxEstimateInput {
  taxYear: number;
  filingStatus: 'single' | 'mfj' | 'mfs' | 'hoh';
  state: string;
  w2Income: number;
  selfEmploymentIncome: number;
  investmentIncome: { dividends: number; longTermGains: number; shortTermGains: number };
  deductions: { standard: boolean; itemized: number; hsa: number; retirement401k: number };
  withholdingYtd: number;
  estimatedPaymentsYtd: number;
}

const FEDERAL_BRACKETS_2024 = {
  single: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  mfj: [
    { upTo: 23200, rate: 0.1 },
    { upTo: 94300, rate: 0.12 },
    { upTo: 201050, rate: 0.22 },
    { upTo: 383900, rate: 0.24 },
    { upTo: 487450, rate: 0.32 },
    { upTo: 731200, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

export function estimateTax(input: TaxEstimateInput) {
  const grossIncome =
    input.w2Income +
    input.selfEmploymentIncome +
    input.investmentIncome.dividends +
    input.investmentIncome.longTermGains +
    input.investmentIncome.shortTermGains;

  const seTax = input.selfEmploymentIncome * 0.9235 * 0.153;
  const deductions = input.deductions.standard
    ? input.filingStatus === 'mfj'
      ? 29200
      : 14600
    : input.deductions.itemized;
  const taxableIncome = Math.max(
    0,
    grossIncome - deductions - input.deductions.hsa - input.deductions.retirement401k,
  );

  const brackets = FEDERAL_BRACKETS_2024[input.filingStatus === 'mfj' ? 'mfj' : 'single'];
  let federalTax = 0;
  let remaining = taxableIncome;
  let prevLimit = 0;
  const bracketBreakdown: { bracket: string; income: number; tax: number }[] = [];

  for (const b of brackets) {
    const taxable = Math.min(remaining, b.upTo - prevLimit);
    if (taxable <= 0) break;
    const tax = taxable * b.rate;
    federalTax += tax;
    bracketBreakdown.push({
      bracket: `${(b.rate * 100).toFixed(0)}%`,
      income: taxable,
      tax,
    });
    remaining -= taxable;
    prevLimit = b.upTo;
  }

  federalTax += seTax;
  const stateTax = taxableIncome * 0.05;
  const totalTax = federalTax + stateTax;
  const paid = input.withholdingYtd + input.estimatedPaymentsYtd;

  return {
    federalTax,
    stateTax,
    selfEmploymentTax: seTax,
    totalTax,
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    marginalRate: brackets.find((b) => taxableIncome <= b.upTo)?.rate ?? 0.37,
    owedOrRefund: totalTax - paid,
    quarterlyPayment: Math.max(0, (totalTax - paid) / 4),
    safeHarborMet: paid >= totalTax * 0.9,
    bracketBreakdown,
  };
}

export interface DebtAccount {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export function simulateDebtPayoff(
  debts: DebtAccount[],
  extraPayment: number,
  strategy: 'avalanche' | 'snowball',
) {
  const sorted = [...debts].sort((a, b) =>
    strategy === 'avalanche'
      ? b.interestRate - a.interestRate
      : a.balance - b.balance,
  );

  let totalInterest = 0;
  let months = 0;
  const balances = sorted.map((d) => ({ ...d, balance: d.balance }));

  while (balances.some((d) => d.balance > 0) && months < 600) {
    months++;
    let extra = extraPayment;
    for (const debt of balances) {
      if (debt.balance <= 0) continue;
      const interest = (debt.balance * debt.interestRate) / 12;
      totalInterest += interest;
      debt.balance += interest;
      const payment = Math.min(debt.balance, debt.minimumPayment);
      debt.balance -= payment;
    }
    const target = balances.find((d) => d.balance > 0);
    if (target && extra > 0) {
      const payment = Math.min(target.balance, extra);
      target.balance -= payment;
      extra -= payment;
    }
  }

  return { months, totalInterest, strategy };
}

export function calculateHealthScore(metrics: {
  emergencyFundMonths: number;
  dti: number;
  savingsRate: number;
  allocationDrift: number;
  incomeVolatility: number;
  goalProgress: number;
  dataFreshness: number;
  budgetAdherence: number;
}): { overall: number; subScores: Record<string, number>; actions: Array<{ action: string; impact: number }> } {
  const subScores = {
    emergencyFund: Math.min(100, (metrics.emergencyFundMonths / 6) * 100),
    debt: Math.max(0, 100 - metrics.dti * 200),
    savingsRate: Math.min(100, metrics.savingsRate * 400),
    diversification: Math.max(0, 100 - metrics.allocationDrift * 10),
    cashFlowStability: Math.max(0, 100 - metrics.incomeVolatility * 100),
    goalProgress: metrics.goalProgress * 100,
    dataFreshness: metrics.dataFreshness * 100,
    budgetAdherence: metrics.budgetAdherence * 100,
  };

  const weights = {
    emergencyFund: 0.2,
    debt: 0.15,
    savingsRate: 0.2,
    diversification: 0.15,
    cashFlowStability: 0.1,
    goalProgress: 0.1,
    dataFreshness: 0.05,
    budgetAdherence: 0.05,
  };

  let overall = 0;
  for (const [key, weight] of Object.entries(weights)) {
    overall += subScores[key as keyof typeof subScores] * weight;
  }

  const actions: Array<{ action: string; impact: number }> = [];
  if (subScores.emergencyFund < 70) actions.push({ action: 'Build emergency fund to 6 months expenses', impact: 15 });
  if (subScores.savingsRate < 60) actions.push({ action: 'Increase savings rate to 15%+', impact: 12 });
  if (subScores.debt < 60) actions.push({ action: 'Reduce debt-to-income ratio', impact: 10 });

  return { overall: Math.round(overall), subScores, actions };
}

export function calculateFIRE(yearlyExpenses: number, currentPortfolio: number, savingsRate: number, expectedReturn = 0.07) {
  const fireNumber = yearlyExpenses * 25;
  const yearsToFI =
    currentPortfolio >= fireNumber
      ? 0
      : Math.log((fireNumber * expectedReturn + savingsRate) / (currentPortfolio * expectedReturn + savingsRate)) /
        Math.log(1 + expectedReturn);
  return {
    fireNumber,
    yearsToFI: Math.max(0, yearsToFI),
    progress: Math.min(100, (currentPortfolio / fireNumber) * 100),
    coastFI: fireNumber / Math.pow(1 + expectedReturn, yearsToFI),
  };
}

export function forecastCashFlow(
  months: number,
  startingBalance: number,
  monthlyIncome: number,
  monthlyExpenses: number,
  incomeGrowth = 0.03,
  expenseGrowth = 0.025,
) {
  const series: { month: number; balance: number; income: number; expenses: number }[] = [];
  let balance = startingBalance;
  let income = monthlyIncome;
  let expenses = monthlyExpenses;

  for (let m = 1; m <= months; m++) {
    balance += income - expenses;
    series.push({ month: m, balance, income, expenses });
    if (m % 12 === 0) {
      income *= 1 + incomeGrowth;
      expenses *= 1 + expenseGrowth;
    }
  }
  return series;
}

export interface BillEvent {
  date: string;
  label: string;
  amount: number;
  type: 'recurring' | 'liability';
  sourceId: string;
}

export interface RecurringInput {
  id: string;
  description?: string;
  averageAmount?: number;
  frequency?: string;
  lastDate?: string;
  isActive?: boolean;
}

export interface LiabilityInput {
  id: string;
  liabilityType?: string;
  minimumPayment?: number;
  nextPaymentDue?: string;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

function frequencyToDays(frequency?: string): number {
  switch (frequency?.toLowerCase()) {
    case 'weekly':
      return 7;
    case 'biweekly':
      return 14;
    case 'monthly':
      return 30;
    case 'annually':
    case 'yearly':
      return 365;
    default:
      return 30;
  }
}

export function buildBillCalendar(
  recurring: RecurringInput[],
  liabilities: LiabilityInput[],
  days = 30,
  startDate: Date = new Date(),
): BillEvent[] {
  const endDate = addDays(startDate, days);
  const events: BillEvent[] = [];

  for (const stream of recurring) {
    if (stream.isActive === false) continue;
    const amount = Math.abs(stream.averageAmount ?? 0);
    if (amount <= 0) continue;

    const interval = frequencyToDays(stream.frequency);
    let cursor = stream.lastDate ? new Date(stream.lastDate) : new Date(startDate);
    while (cursor <= endDate) {
      if (cursor >= startDate) {
        events.push({
          date: toIsoDate(cursor),
          label: stream.description ?? 'Recurring payment',
          amount,
          type: 'recurring',
          sourceId: stream.id,
        });
      }
      cursor = addDays(cursor, interval);
    }
  }

  for (const liability of liabilities) {
    const amount = Math.abs(liability.minimumPayment ?? 0);
    if (amount <= 0 || !liability.nextPaymentDue) continue;
    const due = new Date(liability.nextPaymentDue);
    if (due >= startDate && due <= endDate) {
      events.push({
        date: toIsoDate(due),
        label: liability.liabilityType ?? 'Debt payment',
        amount,
        type: 'liability',
        sourceId: liability.id,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/** @deprecated Use buildBillCalendar for 30-day bill timelines */
export const eventDrivenCashFlowTimeline = buildBillCalendar;

export interface HoldingInput {
  id: string;
  securityName?: string;
  securityType?: string;
  ticker?: string;
  institutionValue?: number;
}

export interface AllocationTarget {
  equity: number;
  fixedIncome: number;
  cash: number;
}

export const DEFAULT_ALLOCATION_TARGET: AllocationTarget = {
  equity: 0.6,
  fixedIncome: 0.25,
  cash: 0.15,
};

export interface AllocationSlice {
  name: string;
  value: number;
  percent: number;
  targetPercent: number;
  drift: number;
}

export function portfolioAllocation(
  holdings: HoldingInput[],
  cashBalance = 0,
  target: AllocationTarget = DEFAULT_ALLOCATION_TARGET,
) {
  let equity = 0;
  let fixedIncome = 0;

  for (const h of holdings) {
    const val = h.institutionValue ?? 0;
    const type = (h.securityType ?? '').toLowerCase();
    if (type.includes('bond') || type.includes('fixed')) {
      fixedIncome += val;
    } else {
      equity += val;
    }
  }

  if (equity === 0 && fixedIncome === 0) {
    equity = holdings.reduce((s, h) => s + (h.institutionValue ?? 0), 0);
  }

  const cash = cashBalance;
  const total = equity + fixedIncome + cash;
  if (total <= 0) {
    return {
      total: 0,
      slices: [] as AllocationSlice[],
      driftScore: 0,
      target,
    };
  }

  const actual = {
    equity: equity / total,
    fixedIncome: fixedIncome / total,
    cash: cash / total,
  };

  const slices: AllocationSlice[] = [
    {
      name: 'Equity',
      value: equity,
      percent: actual.equity * 100,
      targetPercent: target.equity * 100,
      drift: (actual.equity - target.equity) * 100,
    },
    {
      name: 'Fixed Income',
      value: fixedIncome,
      percent: actual.fixedIncome * 100,
      targetPercent: target.fixedIncome * 100,
      drift: (actual.fixedIncome - target.fixedIncome) * 100,
    },
    {
      name: 'Cash',
      value: cash,
      percent: actual.cash * 100,
      targetPercent: target.cash * 100,
      drift: (actual.cash - target.cash) * 100,
    },
  ];

  const driftScore =
    Math.abs(actual.equity - target.equity) +
    Math.abs(actual.fixedIncome - target.fixedIncome) +
    Math.abs(actual.cash - target.cash);

  return { total, slices, driftScore: driftScore * 100, target };
}

export interface ScenarioInput {
  name: string;
  startingBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  months: number;
  incomeChangePct?: number;
  expenseChangePct?: number;
  oneTimeExpense?: number;
  oneTimeExpenseMonth?: number;
}

export interface ScenarioMonthResult {
  month: number;
  balance: number;
  income: number;
  expenses: number;
  net: number;
}

export function runScenario(input: ScenarioInput) {
  const series: ScenarioMonthResult[] = [];
  let balance = input.startingBalance;
  let income = input.monthlyIncome;
  let expenses = input.monthlyExpenses;

  for (let m = 1; m <= input.months; m++) {
    if (input.incomeChangePct && m > 1) {
      income *= 1 + input.incomeChangePct / 100 / 12;
    }
    if (input.expenseChangePct && m > 1) {
      expenses *= 1 + input.expenseChangePct / 100 / 12;
    }
    let monthExpenses = expenses;
    if (input.oneTimeExpense && input.oneTimeExpenseMonth === m) {
      monthExpenses += input.oneTimeExpense;
    }
    const net = income - monthExpenses;
    balance += net;
    series.push({ month: m, balance, income, expenses: monthExpenses, net });
  }

  const endingBalance = series[series.length - 1]?.balance ?? input.startingBalance;
  const minBalance = series.reduce((min, s) => Math.min(min, s.balance), balance);
  const totalNet = series.reduce((s, r) => s + r.net, 0);

  return {
    name: input.name,
    endingBalance,
    minBalance,
    totalNet,
    series,
    success: minBalance >= 0,
  };
}

export interface CashFlowScheduleItem {
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'annually' | 'one_time';
  type: 'income' | 'expense';
  startMonth?: number;
  month?: number;
  label?: string;
}

function monthlyEquivalent(amount: number, frequency: CashFlowScheduleItem['frequency']): number {
  switch (frequency) {
    case 'weekly':
      return amount * (52 / 12);
    case 'biweekly':
      return amount * (26 / 12);
    case 'annually':
      return amount / 12;
    case 'one_time':
      return 0;
    default:
      return amount;
  }
}

export function eventDrivenCashFlow(
  months: number,
  startingBalance: number,
  schedule: CashFlowScheduleItem[],
) {
  const series: Array<{
    month: number;
    balance: number;
    income: number;
    expenses: number;
    events: Array<{ label?: string; amount: number; type: 'income' | 'expense' }>;
  }> = [];
  let balance = startingBalance;

  for (let m = 1; m <= months; m++) {
    let income = 0;
    let expenses = 0;
    const events: Array<{ label?: string; amount: number; type: 'income' | 'expense' }> = [];

    for (const item of schedule) {
      if (item.startMonth !== undefined && m < item.startMonth) continue;

      if (item.frequency === 'one_time') {
        if (item.month !== m) continue;
        const amt = Math.abs(item.amount);
        if (item.type === 'income') {
          income += amt;
          events.push({ label: item.label, amount: amt, type: 'income' });
        } else {
          expenses += amt;
          events.push({ label: item.label, amount: amt, type: 'expense' });
        }
        continue;
      }

      const monthly = monthlyEquivalent(Math.abs(item.amount), item.frequency);
      if (item.type === 'income') {
        income += monthly;
        events.push({ label: item.label, amount: monthly, type: 'income' });
      } else {
        expenses += monthly;
        events.push({ label: item.label, amount: monthly, type: 'expense' });
      }
    }

    balance += income - expenses;
    series.push({ month: m, balance, income, expenses, events });
  }

  return { model: 'event_driven' as const, series };
}
