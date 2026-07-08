import type OpenAI from 'openai';
import { AGENT_PROMPTS, type AgentType } from './agents';

export type AgentToolName =
  | 'get_net_worth'
  | 'get_cash_flow'
  | 'run_monte_carlo'
  | 'simulate_debt'
  | 'search_knowledge';

export interface ToolCallRecord {
  id: string;
  name: AgentToolName;
  arguments: Record<string, unknown>;
  result: unknown;
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

export const AGENT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_net_worth',
      description: 'Get current net worth breakdown: total assets, liabilities, cash, investments, and credit debt.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cash_flow',
      description: 'Get monthly income, expenses, and savings rate from transaction history.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_monte_carlo',
      description: 'Run a Monte Carlo retirement simulation with configurable contributions and withdrawals.',
      parameters: {
        type: 'object',
        properties: {
          monthlyContribution: { type: 'number', description: 'Monthly savings contribution in dollars' },
          monthlyWithdrawal: { type: 'number', description: 'Monthly withdrawal in retirement' },
          years: { type: 'number', description: 'Years to simulate' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'simulate_debt',
      description: 'Simulate debt payoff using avalanche or snowball strategy.',
      parameters: {
        type: 'object',
        properties: {
          extraPayment: { type: 'number', description: 'Extra monthly payment beyond minimums' },
          strategy: { type: 'string', enum: ['avalanche', 'snowball'], description: 'Payoff strategy' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_knowledge',
      description: 'Search the financial knowledge base for educational content on taxes, retirement, investing, debt, budgeting, and subscriptions.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          domain: {
            type: 'string',
            enum: ['taxes', 'retirement', 'investing', 'debt', 'budgeting', 'subscriptions'],
            description: 'Optional domain filter',
          },
        },
        required: ['query'],
      },
    },
  },
];

export async function chatWithTools(
  client: OpenAI,
  agentType: AgentType,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  financialContext: string,
  toolHandlers: Partial<Record<AgentToolName, ToolHandler>>,
  maxRounds = 5,
): Promise<{ content: string; tokensUsed: number; toolCalls: ToolCallRecord[] }> {
  const toolCalls: ToolCallRecord[] = [];
  let totalTokens = 0;

  const systemMessage = {
    role: 'system' as const,
    content: `${AGENT_PROMPTS[agentType]}\n\nYou have access to tools to query the user's financial data and search educational content. Use tools when you need specific numbers or knowledge articles.\n\nUser financial context:\n${financialContext}`,
  };

  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    systemMessage,
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  for (let round = 0; round < maxRounds; round++) {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      tools: AGENT_TOOLS,
    });

    totalTokens += response.usage?.total_tokens ?? 0;
    const choice = response.choices[0]?.message;
    if (!choice) break;

    if (choice.tool_calls?.length) {
      chatMessages.push(choice);

      for (const tc of choice.tool_calls) {
        if (tc.type !== 'function') continue;
        const name = tc.function.name as AgentToolName;
        const args = JSON.parse(tc.function.arguments || '{}') as Record<string, unknown>;
        const handler = toolHandlers[name];
        let result: unknown;
        try {
          result = handler ? await handler(args) : { error: `Unknown tool: ${name}` };
        } catch (e) {
          result = { error: e instanceof Error ? e.message : 'Tool execution failed' };
        }
        toolCalls.push({ id: tc.id, name, arguments: args, result });
        chatMessages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    return {
      content: choice.content ?? '',
      tokensUsed: totalTokens,
      toolCalls,
    };
  }

  return { content: 'I was unable to complete the request. Please try again.', tokensUsed: totalTokens, toolCalls };
}
