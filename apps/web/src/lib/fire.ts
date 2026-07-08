import type { FireResult } from '@/lib/api';

export function calculateFIRE(
  yearlyExpenses: number,
  currentPortfolio: number,
  savingsRate: number,
  expectedReturn = 0.07,
): FireResult {
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

export function generateFireProjection(
  yearlyExpenses: number,
  currentPortfolio: number,
  savingsRate: number,
  expectedReturn = 0.07,
) {
  const { fireNumber, yearsToFI } = calculateFIRE(
    yearlyExpenses,
    currentPortfolio,
    savingsRate,
    expectedReturn,
  );
  const maxYears = Math.max(Math.ceil(yearsToFI) + 3, 10);
  const data: Array<{ year: number; portfolio: number; target: number }> = [];
  let portfolio = currentPortfolio;

  for (let year = 0; year <= maxYears; year++) {
    data.push({
      year,
      portfolio: Math.round(portfolio),
      target: Math.round(fireNumber),
    });
    portfolio = portfolio * (1 + expectedReturn) + savingsRate;
  }

  return data;
}
