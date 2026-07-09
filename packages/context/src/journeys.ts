export interface JourneyStep {
  id: string;
  label: string;
  route: string;
  description?: string;
}

export interface JourneyHub {
  id: string;
  label: string;
  route: string;
  steps: JourneyStep[];
}

export const JOURNEY_HUBS: JourneyHub[] = [
  {
    id: 'command',
    label: 'Command Center',
    route: '/app',
    steps: [
      { id: 'link-account', label: 'Link an account', route: '/app/accounts' },
      { id: 'review-inbox', label: 'Clear your inbox', route: '/app/inbox' },
      { id: 'check-insights', label: 'Review insights', route: '/app/insights' },
    ],
  },
  {
    id: 'cash-flow',
    label: 'Cash Flow',
    route: '/app/cash-flow',
    steps: [
      { id: 'link-account', label: 'Link an account', route: '/app/accounts' },
      { id: 'categorize-10', label: 'Categorize 10 transactions', route: '/app/inbox' },
      { id: 'review-subscriptions', label: 'Review subscriptions', route: '/app/subscriptions' },
    ],
  },
  {
    id: 'plan',
    label: 'Plan & Control',
    route: '/app/plan',
    steps: [
      { id: 'first-budget', label: 'Set first budget', route: '/app/budgets' },
      { id: 'first-goal', label: 'Create a goal', route: '/app/goals' },
      { id: 'first-rule', label: 'Create an automation rule', route: '/app/rules' },
    ],
  },
  {
    id: 'wealth',
    label: 'Wealth',
    route: '/app/wealth',
    steps: [
      { id: 'view-net-worth', label: 'View net worth trend', route: '/app/net-worth' },
      { id: 'check-investments', label: 'Review investments', route: '/app/investments' },
      { id: 'run-forecast', label: 'Run cash flow forecast', route: '/app/forecasts' },
    ],
  },
  {
    id: 'future',
    label: 'Future',
    route: '/app/future',
    steps: [
      { id: 'retirement-age', label: 'Set retirement age', route: '/app/retirement' },
      { id: 'monte-carlo', label: 'Run Monte Carlo', route: '/app/retirement' },
      { id: 'debt-plan', label: 'Create debt payoff plan', route: '/app/debt' },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    route: '/app/library',
    steps: [
      { id: 'complete-setup', label: 'Complete setup wizard', route: '/app/onboarding' },
      { id: 'upload-doc', label: 'Upload a document', route: '/app/documents' },
      { id: 'learn-article', label: 'Read a learn article', route: '/app/learn' },
    ],
  },
];

export function getJourneyHub(hubId: string): JourneyHub | undefined {
  return JOURNEY_HUBS.find((h) => h.id === hubId);
}
