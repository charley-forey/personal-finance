'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: () => api.accounts() });
}

export function useTransactions(limit = 50) {
  return useQuery({ queryKey: ['transactions', limit], queryFn: () => api.transactions(limit) });
}

export function useTransactionsSearch(limit = 50, search = '') {
  return useQuery({
    queryKey: ['transactions', limit, search],
    queryFn: () => api.transactions(limit, search || undefined),
  });
}

export function useNetWorth() {
  return useQuery({ queryKey: ['net-worth'], queryFn: () => api.netWorth() });
}

export function useCashFlow() {
  return useQuery({ queryKey: ['cash-flow'], queryFn: () => api.cashFlow() });
}

export function useInsights() {
  return useQuery({ queryKey: ['insights'], queryFn: () => api.insights() });
}

export function useHealthScore() {
  return useQuery({ queryKey: ['health-score'], queryFn: () => api.healthScore() });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => api.categories() });
}

export function useInbox() {
  return useQuery({ queryKey: ['inbox'], queryFn: () => api.inbox() });
}

export function useBudgets() {
  return useQuery({ queryKey: ['budgets'], queryFn: () => api.budgets() });
}

export function useBudgetActuals() {
  return useQuery({ queryKey: ['budget-actuals'], queryFn: () => api.budgetActuals() });
}

export function useGoals() {
  return useQuery({ queryKey: ['goals'], queryFn: () => api.goals() });
}

export function useHoldings() {
  return useQuery({ queryKey: ['holdings'], queryFn: () => api.holdings() });
}

export function useLiabilities() {
  return useQuery({ queryKey: ['liabilities'], queryFn: () => api.liabilities() });
}

export function useRecurring() {
  return useQuery({ queryKey: ['recurring'], queryFn: () => api.recurring() });
}

export function useActivity() {
  return useQuery({ queryKey: ['activity'], queryFn: () => api.activity() });
}

export function usePlaidItems() {
  return useQuery({ queryKey: ['plaid-items'], queryFn: () => api.plaidItems() });
}

export function usePreferences() {
  return useQuery({ queryKey: ['preferences'], queryFn: () => api.preferences() });
}

export function useBillingPlan() {
  return useQuery({ queryKey: ['billing-plan'], queryFn: () => api.billingPlan() });
}

export function useInvalidateFinance() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['accounts'] });
    qc.invalidateQueries({ queryKey: ['transactions'] });
    qc.invalidateQueries({ queryKey: ['net-worth'] });
    qc.invalidateQueries({ queryKey: ['cash-flow'] });
    qc.invalidateQueries({ queryKey: ['insights'] });
    qc.invalidateQueries({ queryKey: ['health-score'] });
    qc.invalidateQueries({ queryKey: ['inbox'] });
    qc.invalidateQueries({ queryKey: ['plaid-items'] });
    qc.invalidateQueries({ queryKey: ['recurring'] });
    qc.invalidateQueries({ queryKey: ['liabilities'] });
    qc.invalidateQueries({ queryKey: ['activity'] });
  };
}

export function useGenerateInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.generateInsight(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createGoal>[0]) => api.createGoal(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}
