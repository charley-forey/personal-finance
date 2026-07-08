import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFIRE,
  simulateDebtPayoff,
  calculateHealthScore,
  forecastCashFlow,
  estimateTax,
  runMonteCarlo,
  eventDrivenCashFlow,
} from '../src/index';

describe('calculateFIRE', () => {
  it('computes years to FIRE', () => {
    const result = calculateFIRE(60000, 500000, 24000);
    assert.ok(result.yearsToFI >= 0);
    assert.ok(result.fireNumber > 0);
  });
});

describe('simulateDebtPayoff', () => {
  it('avalanche produces valid payoff plan', () => {
    const debts = [{ name: 'Card', balance: 5000, interestRate: 0.22, minimumPayment: 150 }];
    const result = simulateDebtPayoff(debts, 200, 'avalanche');
    assert.ok(result.months > 0);
    assert.ok(result.totalInterest > 0);
  });
});

describe('eventDrivenCashFlow', () => {
  it('projects balance from scheduled events', () => {
    const result = eventDrivenCashFlow(3, 1000, [
      { amount: 500, frequency: 'monthly', type: 'income', label: 'Salary' },
      { amount: 200, frequency: 'monthly', type: 'expense', label: 'Rent' },
    ]);
    assert.equal(result.model, 'event_driven');
    assert.equal(result.series.length, 3);
    assert.ok(result.series[2]!.balance > 1000);
  });
});

describe('calculateHealthScore', () => {
  it('returns score between 0 and 100', () => {
    const score = calculateHealthScore({
      emergencyFundMonths: 6,
      dti: 0.2,
      savingsRate: 0.2,
      allocationDrift: 5,
      incomeVolatility: 0.1,
      goalProgress: 0.5,
      dataFreshness: 1,
      budgetAdherence: 0.9,
    });
    assert.ok(score.overall >= 0);
    assert.ok(score.overall <= 100);
  });
});

describe('forecastCashFlow', () => {
  it('projects balance over months with growth', () => {
    const series = forecastCashFlow(24, 10000, 5000, 4000);
    assert.equal(series.length, 24);
    assert.ok(series[0]!.balance > 10000);
    assert.ok(series[23]!.income >= series[0]!.income);
  });
});

describe('estimateTax', () => {
  it('computes federal and state tax for W2 income', () => {
    const result = estimateTax({
      taxYear: 2024,
      filingStatus: 'single',
      state: 'CA',
      w2Income: 100000,
      selfEmploymentIncome: 0,
      investmentIncome: { dividends: 0, longTermGains: 0, shortTermGains: 0 },
      deductions: { standard: true, itemized: 0, hsa: 0, retirement401k: 0 },
      withholdingYtd: 15000,
      estimatedPaymentsYtd: 0,
    });
    assert.ok(result.federalTax > 0);
    assert.ok(result.stateTax > 0);
    assert.ok(result.totalTax > 0);
    assert.ok(result.effectiveRate > 0 && result.effectiveRate < 1);
  });
});

describe('runMonteCarlo', () => {
  it('returns success rate and percentile paths', () => {
    const result = runMonteCarlo({
      currentPortfolio: 500000,
      monthlyContribution: 2000,
      monthlyWithdrawal: 4000,
      yearsToSimulate: 30,
      assetAllocation: { stocks: 0.7, bonds: 0.25, cash: 0.05 },
      assumptions: {
        stockReturnMean: 0.1,
        stockReturnStd: 0.15,
        bondReturnMean: 0.04,
        bondReturnStd: 0.05,
        inflationMean: 0.025,
        inflationStd: 0.01,
      },
      retirementYear: 20,
      numSimulations: 100,
    });
    assert.ok(result.successRate >= 0 && result.successRate <= 100);
    assert.ok(result.medianEndingBalance >= 0);
    assert.equal(result.percentiles.p50.length, 30);
  });
});
