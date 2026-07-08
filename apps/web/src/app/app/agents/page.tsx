'use client';

import { useEffect, useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Button } from '@/components/ui';
import { api, type AgentConversation } from '@/lib/api';
import { Bot, MessageSquare, Plus, Sparkles } from 'lucide-react';

const AGENTS = [
  {
    id: 'general_cfo',
    name: 'CFO',
    description: 'Holistic financial overview and strategy',
    icon: Bot,
  },
  {
    id: 'tax_advisor',
    name: 'Tax Advisor',
    description: 'Tax planning and optimization guidance',
    icon: Sparkles,
  },
  {
    id: 'retirement_planner',
    name: 'Retirement',
    description: 'Monte Carlo and withdrawal planning',
    icon: MessageSquare,
  },
  {
    id: 'budget_coach',
    name: 'Budget Coach',
    description: 'Spending patterns and savings tips',
    icon: MessageSquare,
  },
  {
    id: 'investment_analyst',
    name: 'Investment',
    description: 'Allocation, diversification, and drift',
    icon: MessageSquare,
  },
] as const;

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  general_cfo: [
    'Give me a summary of my financial health',
    'What should I focus on this month?',
    'How is my savings rate compared to benchmarks?',
  ],
  tax_advisor: [
    'What tax moves should I consider before year end?',
    'How can I reduce my taxable income?',
    'Explain estimated tax payments',
  ],
  retirement_planner: [
    'Run a Monte Carlo simulation for my retirement',
    'Am I on track to retire at 65?',
    'What withdrawal rate is safe for my portfolio?',
  ],
  budget_coach: [
    'Where am I overspending this month?',
    'How can I increase my savings rate?',
    'Review my cash flow trends',
  ],
  investment_analyst: [
    'How diversified is my portfolio?',
    'Is my allocation drifting from target?',
    'Explain my current asset mix',
  ],
};

function conversationPreview(conv: AgentConversation) {
  const messages = conv.messagesJson ?? [];
  const first = messages.find((m) => m.role === 'user');
  return first?.content?.slice(0, 60) ?? 'New conversation';
}

export default function AgentsPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [agentType, setAgentType] = useState('general_cfo');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    api
      .agentConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConversations(false));
  }, []);

  function startNewChat() {
    setConversationId(undefined);
    setMessages([]);
    setMessage('');
  }

  function loadConversation(conv: AgentConversation) {
    setConversationId(conv.id);
    setAgentType(conv.agentType);
    setMessages(
      (conv.messagesJson ?? [])
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    );
  }

  async function send(text?: string) {
    const msg = text ?? message;
    if (!msg.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setMessage('');
    try {
      const res = await api.agentChat(agentType, msg, conversationId);
      setConversationId(res.conversationId);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
      const updated = await api.agentConversations();
      setConversations(updated);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: e instanceof Error ? e.message : 'Error' },
      ]);
    }
    setLoading(false);
  }

  const selectedAgent = AGENTS.find((a) => a.id === agentType) ?? AGENTS[0];
  const prompts = SUGGESTED_PROMPTS[agentType] ?? SUGGESTED_PROMPTS.general_cfo;

  return (
    <div>
      <PageHeader title="AI Agents" description="Domain-expert agents with access to your financial data" />

      <div className="flex gap-6">
        {sidebarOpen && (
          <aside className="w-64 shrink-0 hidden md:block">
            <Button className="w-full mb-4" size="sm" onClick={startNewChat}>
              <Plus className="w-4 h-4" /> New chat
            </Button>
            {loadingConversations ? (
              <PageLoading variant="list" count={3} />
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <Button
                    key={conv.id}
                    variant={conversationId === conv.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start truncate ${
                      conversationId === conv.id ? 'border border-primary/30 bg-primary/20' : ''
                    }`}
                    onClick={() => loadConversation(conv)}
                  >
                    <span className="text-xs text-muted block capitalize w-full text-left">
                      {conv.agentType.replace(/_/g, ' ')}
                    </span>
                    <span className="truncate w-full text-left">{conversationPreview(conv)}</span>
                  </Button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-xs text-muted px-3">No conversations yet</p>
                )}
              </div>
            )}
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-4 flex-wrap">
            {AGENTS.map((a) => (
              <Button
                key={a.id}
                variant={agentType === a.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setAgentType(a.id);
                  startNewChat();
                }}
              >
                {a.name}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              History
            </Button>
          </div>

          <p className="text-sm text-muted mb-4">{selectedAgent.description}</p>

          <Card>
            {messages.length > 0 && (
              <div className="mb-4 space-y-4 max-h-96 overflow-y-auto">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      m.role === 'user'
                        ? 'bg-primary/10 ml-8'
                        : 'bg-background border border-card-border mr-8'
                    }`}
                  >
                    <span className="text-xs text-muted block mb-1 capitalize">{m.role}</span>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </div>
            )}

            {messages.length === 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted mb-3">Suggested prompts</p>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((p) => (
                    <Button
                      key={p}
                      variant="secondary"
                      size="sm"
                      disabled={loading}
                      className="text-left h-auto whitespace-normal py-2"
                      onClick={() => send(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about your finances..."
              className="w-full h-24 bg-background border border-card-border rounded-lg p-3 text-sm"
            />
            <Button
              className="mt-4"
              onClick={() => send()}
              disabled={loading || !message}
            >
              {loading ? 'Thinking…' : 'Send'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
