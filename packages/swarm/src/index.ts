import type { AgentType } from '@pf/shared';

export interface SwarmTask {
  query: string;
  agents: AgentType[];
}

export interface SwarmResult {
  synthesis: string;
  agentOutputs: Array<{ agent: AgentType; summary: string }>;
}

export function decomposeQuery(query: string): SwarmTask {
  const lower = query.toLowerCase();
  const agents: AgentType[] = ['general_cfo'];
  if (lower.includes('tax')) agents.push('tax_advisor');
  if (lower.includes('retire') || lower.includes('401')) agents.push('retirement_planner');
  if (lower.includes('budget') || lower.includes('spend')) agents.push('budget_coach');
  if (lower.includes('invest') || lower.includes('portfolio')) agents.push('investment_analyst');
  if (lower.includes('debt')) agents.push('debt_optimizer');
  return { query, agents: [...new Set(agents)] };
}

export function synthesizeSwarm(outputs: Array<{ agent: AgentType; summary: string }>): SwarmResult {
  const synthesis = outputs.map((o) => `[${o.agent}] ${o.summary}`).join('\n\n');
  return { synthesis, agentOutputs: outputs };
}
