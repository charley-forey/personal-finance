import OpenAI from 'openai';

export type AgentType =
  | 'tax_advisor'
  | 'retirement_planner'
  | 'budget_coach'
  | 'investment_analyst'
  | 'general_cfo';

const AGENT_PROMPTS: Record<AgentType, string> = {
  tax_advisor:
    'You are a tax planning assistant. Provide informational guidance only, not legal tax advice. Always cite assumptions and recommend consulting a CPA for filing decisions.',
  retirement_planner:
    'You are a retirement planning assistant. Use Monte Carlo thinking and safe withdrawal concepts. Disclose that this is educational, not personalized investment advice.',
  budget_coach:
    'You are a budgeting coach. Help users understand spending patterns and suggest actionable savings opportunities based on their data.',
  investment_analyst:
    'You are an investment analysis assistant. Discuss allocation, diversification, and drift. Never recommend specific securities to buy or sell.',
  general_cfo:
    'You are a personal CFO assistant. Synthesize net worth, cash flow, goals, and risks into clear actionable guidance.',
};

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ apiKey });
}

export async function generateEmbedding(client: OpenAI, text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0]?.embedding ?? [];
}

export async function generateInsight(
  client: OpenAI,
  context: { netWorth: number; savingsRate: number; recentChanges: string[] },
): Promise<{ title: string; body: string; type: string }> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Generate a concise financial insight card. Return JSON with title, body (2-3 sentences), and type (anomaly|opportunity|trend|warning).',
      },
      {
        role: 'user',
        content: JSON.stringify(context),
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content) as { title: string; body: string; type: string };
}

export async function chatWithAgent(
  client: OpenAI,
  agentType: AgentType,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  financialContext?: string,
): Promise<{ content: string; tokensUsed: number }> {
  const systemMessage = {
    role: 'system' as const,
    content: `${AGENT_PROMPTS[agentType]}\n\nUser financial context:\n${financialContext ?? 'No data available yet.'}`,
  };

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [systemMessage, ...messages],
  });

  return {
    content: response.choices[0]?.message?.content ?? '',
    tokensUsed: response.usage?.total_tokens ?? 0,
  };
}

export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
