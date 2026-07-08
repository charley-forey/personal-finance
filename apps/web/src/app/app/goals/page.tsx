'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { useGoals, useCreateGoal } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function GoalsPage() {
  const { data: goals } = useGoals();
  const createGoal = useCreateGoal();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', goalType: 'custom' });

  return (
    <div>
      <PageHeader
        title="Goals"
        description="Track progress toward financial milestones"
        actions={
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm">
            {showForm ? 'Cancel' : 'New Goal'}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <input placeholder="Goal name" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" placeholder="Target amount" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            <select className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.goalType} onChange={(e) => setForm({ ...form, goalType: e.target.value })}>
              <option value="emergency_fund">Emergency Fund</option>
              <option value="retirement">Retirement</option>
              <option value="house">House</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <button
            onClick={() => { createGoal.mutate(form); setShowForm(false); }}
            className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium"
          >
            Create Goal
          </button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(goals ?? []).map((goal) => {
          const current = parseFloat(goal.currentAmount ?? '0');
          const target = parseFloat(goal.targetAmount ?? '0');
          const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
          return (
            <Card key={goal.id}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-primary uppercase">{goal.goalType.replace('_', ' ')}</p>
                  <h3 className="font-semibold mt-1">{goal.name}</h3>
                </div>
                <span className="text-sm font-mono tabular-nums">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-card-border rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-sm text-muted mt-2">{formatCurrency(current)} of {formatCurrency(target)}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
