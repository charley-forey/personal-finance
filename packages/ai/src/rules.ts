import type OpenAI from 'openai';

export interface ParsedAutomationRule {
  name: string;
  triggerType: string;
  actionType: 'create_insight' | 'notify';
  triggerConditionsJson: Record<string, unknown>;
  actionConfigJson: Record<string, unknown>;
}

const TRIGGER_TYPES = [
  'plaid.sync.completed',
  'budget.exceeded',
  'transaction.created',
  'balance.changed',
  'goal.achieved',
] as const;

export async function parseRuleFromText(client: OpenAI, description: string): Promise<ParsedAutomationRule> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Parse a natural-language financial automation rule into JSON with:
- name: short rule name
- triggerType: one of ${TRIGGER_TYPES.join(', ')}
- actionType: "create_insight" or "notify"
- triggerConditionsJson: optional { minAmount?: number, category?: string }
- actionConfigJson: { title?: string, body?: string }

Examples:
"Notify me when I spend over $500 on dining" -> triggerType budget.exceeded or transaction.created, minAmount 500, category dining, actionType notify
"Create an insight when my budget is exceeded" -> triggerType budget.exceeded, actionType create_insight`,
      },
      { role: 'user', content: description },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(content) as Partial<ParsedAutomationRule>;

  return {
    name: parsed.name ?? description.slice(0, 60),
    triggerType: parsed.triggerType ?? 'budget.exceeded',
    actionType: parsed.actionType === 'notify' ? 'notify' : 'create_insight',
    triggerConditionsJson: parsed.triggerConditionsJson ?? {},
    actionConfigJson: parsed.actionConfigJson ?? { title: parsed.name ?? 'Automation alert', body: description },
  };
}
