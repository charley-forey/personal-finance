export type GraphEntityType =
  | 'transaction'
  | 'account'
  | 'category'
  | 'budget'
  | 'goal'
  | 'bill'
  | 'insight'
  | 'recommendation'
  | 'document'
  | 'scenario'
  | 'equity_grant'
  | 'life_plan'
  | 'agent_conversation'
  | 'notification'
  | 'rule';

export type GraphLinkType =
  | 'funds'
  | 'impacts'
  | 'blocks'
  | 'suggests'
  | 'contradicts'
  | 'explains'
  | 'derived_from';

export interface GraphNode {
  type: GraphEntityType;
  id: string;
  label: string;
  route?: string;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  linkType: GraphLinkType;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface GraphNeighbor {
  node: GraphNode;
  edge: GraphEdge;
  direction: 'outgoing' | 'incoming';
}

export interface GraphContext {
  route: string;
  focusNodes: GraphNode[];
  suggestedLinks: GraphNeighbor[];
}

export const ROUTE_ENTITY_MAP: Record<string, { type: GraphEntityType; label: string }> = {
  '/app': { type: 'recommendation', label: 'Dashboard' },
  '/app/accounts': { type: 'account', label: 'Accounts' },
  '/app/transactions': { type: 'transaction', label: 'Transactions' },
  '/app/budgets': { type: 'budget', label: 'Budgets' },
  '/app/goals': { type: 'goal', label: 'Goals' },
  '/app/insights': { type: 'insight', label: 'Insights' },
  '/app/debt': { type: 'bill', label: 'Debt' },
  '/app/net-worth': { type: 'account', label: 'Net Worth' },
  '/app/retirement': { type: 'scenario', label: 'Retirement' },
  '/app/inbox': { type: 'transaction', label: 'Inbox' },
  '/app/scenarios': { type: 'scenario', label: 'Scenarios' },
  '/app/agents': { type: 'agent_conversation', label: 'Agents' },
  '/app/documents': { type: 'document', label: 'Documents' },
  '/app/rules': { type: 'rule', label: 'Rules' },
};

export const ENTITY_ROUTES: Partial<Record<GraphEntityType, string>> = {
  transaction: '/app/transactions',
  account: '/app/accounts',
  category: '/app/transactions',
  budget: '/app/budgets',
  goal: '/app/goals',
  bill: '/app/calendar',
  insight: '/app/insights',
  recommendation: '/app/insights',
  document: '/app/documents',
  scenario: '/app/scenarios',
  equity_grant: '/app/equity',
  life_plan: '/app/life-plans',
  agent_conversation: '/app/agents',
  notification: '/app/notifications',
  rule: '/app/rules',
};
