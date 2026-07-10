'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Button } from '@/components/ui';
import { api, type AgentConversation } from '@/lib/api';
import { useBillingPlan } from '@/hooks/use-finance';
import { Bot, MessageSquare, Plus, Sparkles, X } from 'lucide-react';
import clsx from 'clsx';

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

function ConversationList({
  conversations,
  conversationId,
  loading,
  onNew,
  onSelect,
}: {
  conversations: AgentConversation[];
  conversationId?: string;
  loading: boolean;
  onNew: () => void;
  onSelect: (conv: AgentConversation) => void;
}) {
  return (
    <>
      <Button className="w-full mb-4" size="sm" onClick={onNew}>
        <Plus className="w-4 h-4" /> New chat
      </Button>
      {loading ? (
        <PageLoading variant="list" count={3} />
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={conversationId === conv.id ? 'secondary' : 'ghost'}
              size="sm"
              className={clsx(
                'w-full justify-start truncate',
                conversationId === conv.id && 'border border-primary/30 bg-primary/20',
              )}
              onClick={() => onSelect(conv)}
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
    </>
  );
}

export default function AgentsPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; toolCalls?: unknown[] }>>([]);
  const [agentType, setAgentType] = useState('general_cfo');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetTitleId = useId();
  const { data: billing } = useBillingPlan();
  const aiUsed = billing?.usage.aiMessagesThisMonth ?? 0;
  const aiLimit = billing?.aiMessagesLimit;

  useEffect(() => {
    api
      .agentConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConversations(false));
  }, []);

  useEffect(() => {
    if (!historyOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHistoryOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    sheetRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [historyOpen]);

  function startNewChat() {
    setConversationId(undefined);
    setMessages([]);
    setMessage('');
    setHistoryOpen(false);
  }

  function loadConversation(conv: AgentConversation) {
    setConversationId(conv.id);
    setAgentType(conv.agentType);
    setMessages(
      (conv.messagesJson ?? [])
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    );
    setHistoryOpen(false);
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
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.response, toolCalls: res.toolCalls },
      ]);
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
      <AppPageHeader title="AI Agents" description="Domain-expert agents with access to your financial data" />

      <div className="flex gap-6">
        <aside className="w-64 shrink-0 hidden md:block">
          <ConversationList
            conversations={conversations}
            conversationId={conversationId}
            loading={loadingConversations}
            onNew={startNewChat}
            onSelect={loadConversation}
          />
        </aside>

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
              aria-expanded={historyOpen}
              aria-controls="agents-history-sheet"
              onClick={() => setHistoryOpen(true)}
            >
              History
            </Button>
          </div>

          <p className="text-sm text-muted mb-4">{selectedAgent.description}</p>

          <p className="text-xs text-muted mb-4 rounded-lg border border-card-border bg-background/60 px-3 py-2">
            Agents may call tools against your linked data. LLM usage counts toward your plan limits
            {aiLimit != null
              ? ` (${aiUsed}/${aiLimit} AI messages this month)`
              : ' (unlimited on your current plan)'}
            . Upgrade in Settings if you hit a cap.
          </p>

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
                    {m.role === 'assistant' && Array.isArray(m.toolCalls) && m.toolCalls.length > 0 ? (
                      <p className="text-xs text-muted mb-2">
                        Used {m.toolCalls.length} tool{m.toolCalls.length === 1 ? '' : 's'} against your linked data
                      </p>
                    ) : null}
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

      {historyOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setHistoryOpen(false)}
            aria-hidden
          />
          <div
            id="agents-history-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={sheetTitleId}
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border border-card-border bg-card p-4 safe-bottom"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id={sheetTitleId} className="text-base font-semibold">
                Conversation history
              </h2>
              <button
                type="button"
                aria-label="Close history"
                onClick={() => setHistoryOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ConversationList
              conversations={conversations}
              conversationId={conversationId}
              loading={loadingConversations}
              onNew={startNewChat}
              onSelect={loadConversation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
