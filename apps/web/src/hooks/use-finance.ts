'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { completeJourneyStepSafe } from '@/lib/journey';

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

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: () => api.profile() });
}

export function useRecommendations() {
  return useQuery({ queryKey: ['recommendations'], queryFn: () => api.recommendations() });
}

export function useKnowledgeSearch(q: string, domain?: string) {
  return useQuery({
    queryKey: ['knowledge-search', q, domain],
    queryFn: () => api.knowledgeSearch(q, domain),
    enabled: q.trim().length > 0,
  });
}

export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: () => api.notifications() });
}

export function usePortfolioAllocation() {
  return useQuery({ queryKey: ['portfolio-allocation'], queryFn: () => api.portfolioAllocation() });
}

export function useBillCalendar() {
  return useQuery({ queryKey: ['bill-calendar'], queryFn: () => api.billCalendar() });
}

export function useFire() {
  return useQuery({ queryKey: ['fire'], queryFn: () => api.fire() });
}

export function useTaxEstimate(year?: number) {
  return useQuery({
    queryKey: ['tax-estimate', year],
    queryFn: () => api.taxEstimate(year),
  });
}

export function useDocuments() {
  return useQuery({ queryKey: ['documents'], queryFn: () => api.documents() });
}

export function useRules() {
  return useQuery({ queryKey: ['rules'], queryFn: () => api.rules() });
}

export function usePnl(year: number, month: number) {
  return useQuery({
    queryKey: ['pnl', year, month],
    queryFn: () => api.pnl(year, month),
  });
}

export function useManualAssets() {
  return useQuery({ queryKey: ['manual-assets'], queryFn: () => api.manualAssets() });
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
    qc.invalidateQueries({ queryKey: ['journey-progress'] });
    qc.invalidateQueries({ queryKey: ['preferences'] });
  };
}

export function useGenerateInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.generateInsight(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

export function useGenerateRecommendations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.generateRecommendations(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recommendations'] }),
  });
}

export function useInsightFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      helpful?: boolean;
      actedOn?: boolean;
      dismissed?: boolean;
      reason?: string;
    }) => api.insightFeedback(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof api.createGoal>[0]) => {
      const goal = await api.createGoal(data);
      await completeJourneyStepSafe('plan', 'first-goal');
      return goal;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
      qc.invalidateQueries({ queryKey: ['journey-progress'] });
    },
  });
}

export function usePageContext(route: string) {
  return useQuery({
    queryKey: ['page-context', route],
    queryFn: () => api.pageContext(route),
    staleTime: 60_000,
  });
}

export function useGraphNeighbors(type?: string, id?: string) {
  return useQuery({
    queryKey: ['graph', type, id],
    queryFn: () => api.graphNeighbors(type!, id!),
    enabled: Boolean(type && id),
  });
}

export function useGraphContext(route?: string) {
  return useQuery({
    queryKey: ['graph-context', route],
    queryFn: () => api.graphContext(route!),
    enabled: Boolean(route),
    staleTime: 60_000,
  });
}

export function useNarrativeSession() {
  return useQuery({
    queryKey: ['narrative-session'],
    queryFn: () => api.narrativeSession(),
    staleTime: 300_000,
  });
}

export function useExplainMetric(metric?: string) {
  return useQuery({
    queryKey: ['explain', metric],
    queryFn: () => api.explainMetric(metric!),
    enabled: Boolean(metric),
  });
}

export function useJourneyProgress() {
  return useQuery({
    queryKey: ['journey-progress'],
    queryFn: () => api.journeyProgress(),
  });
}
