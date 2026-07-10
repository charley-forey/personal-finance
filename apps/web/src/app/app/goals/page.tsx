'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input, Select } from '@/components/ui';
import { useGoals, useCreateGoal } from '@/hooks/use-finance';
import { formatCurrency } from '@/lib/api';

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', goalType: 'custom' });

  return (
    <div>
      <AppPageHeader
        title="Goals"
        description="Track progress toward financial milestones"
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Goal'}
          </Button>
        }
      />

      {isLoading && <PageLoading variant="cards" count={2} className="mb-6" />}

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input type="number" placeholder="Target amount" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            <Select
              options={[
                { value: 'emergency_fund', label: 'Emergency Fund' },
                { value: 'retirement', label: 'Retirement' },
                { value: 'house', label: 'House' },
                { value: 'custom', label: 'Custom' },
              ]}
              value={form.goalType}
              onChange={(e) => setForm({ ...form, goalType: e.target.value })}
            />
          </div>
          <Button
            className="mt-4"
            disabled={createGoal.isPending}
            onClick={() => { createGoal.mutate(form); setShowForm(false); }}
          >
            {createGoal.isPending ? 'Creating…' : 'Create Goal'}
          </Button>
        </Card>
      )}

      {!isLoading && goals?.length === 0 && (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set a savings goal to track your progress toward milestones."
          action={
            <Button size="sm" onClick={() => setShowForm(true)}>
              New Goal
            </Button>
          }
        />
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
