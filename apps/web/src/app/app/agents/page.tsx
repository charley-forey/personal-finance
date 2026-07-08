'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { api, setAuthToken } from '@/lib/api';

export default function AgentsPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [agentType, setAgentType] = useState('general_cfo');
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    const token = localStorage.getItem('pf_token');
    if (token) setAuthToken(token);
    try {
      const res = await api.agentChat(agentType, message);
      setResponse(res.response);
    } catch (e) {
      setResponse(e instanceof Error ? e.message : 'Error');
    }
    setLoading(false);
  }

  const agents = [
    { id: 'general_cfo', name: 'CFO' },
    { id: 'tax_advisor', name: 'Tax Advisor' },
    { id: 'retirement_planner', name: 'Retirement' },
    { id: 'budget_coach', name: 'Budget Coach' },
    { id: 'investment_analyst', name: 'Investment' },
  ];

  return (
    <div>
      <PageHeader title="AI Agents" description="Domain-expert agents with access to your financial data" />
      <div className="flex gap-2 mb-6 flex-wrap">
        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => setAgentType(a.id)}
            className={`px-4 py-2 rounded-lg text-sm ${agentType === a.id ? 'bg-primary text-black' : 'bg-card border border-card-border'}`}
          >
            {a.name}
          </button>
        ))}
      </div>
      <Card>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your finances..."
          className="w-full h-24 bg-background border border-card-border rounded-lg p-3 text-sm"
        />
        <button
          onClick={send}
          disabled={loading || !message}
          className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
        {response && (
          <div className="mt-6 p-4 bg-background rounded-lg border border-card-border">
            <p className="text-sm whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
