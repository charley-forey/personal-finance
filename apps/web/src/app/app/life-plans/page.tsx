'use client';

import { useState } from 'react';
import { Map } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input, Select } from '@/components/ui';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function LifePlansPage() {
  const { data: plans, isLoading, refetch } = useQuery({ queryKey: ['life-plans'], queryFn: () => api.lifePlans() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', planType: 'home', targetDate: '' });
  const [creating, setCreating] = useState(false);

  const create = async () => {
    setCreating(true);
    try {
      await api.createLifePlan(form);
      setShowForm(false);
      refetch();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <AppPageHeader
        title="Life Plans"
        description="Home, college, wedding, and major life goals"
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Plan'}
          </Button>
        }
      />

      {isLoading && <PageLoading variant="cards" count={2} className="mb-6" />}

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Select
              options={[
                { value: 'home', label: 'Home' },
                { value: 'college', label: 'College' },
                { value: 'wedding', label: 'Wedding' },
                { value: 'car', label: 'Car' },
                { value: 'sabbatical', label: 'Sabbatical' },
                { value: 'custom', label: 'Custom' },
              ]}
              value={form.planType}
              onChange={(e) => setForm({ ...form, planType: e.target.value })}
            />
            <Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </div>
          <Button className="mt-4" onClick={create} disabled={creating}>
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </Card>
      )}

      {!isLoading && plans?.length === 0 && (
        <EmptyState
          icon={Map}
          title="No life plans yet"
          description="Create a plan for major milestones like buying a home or saving for college."
          action={
            <Button size="sm" onClick={() => setShowForm(true)}>
              New Plan
            </Button>
          }
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(plans ?? []).map((p) => (
          <Card key={p.id}>
            <p className="text-xs text-primary uppercase">{p.planType}</p>
            <h3 className="font-semibold mt-1">{p.name}</h3>
            {p.targetDate && <p className="text-sm text-muted mt-2">Target: {p.targetDate}</p>}
            <span className="text-xs mt-2 inline-block px-2 py-1 rounded bg-card-border">{p.status ?? 'active'}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
