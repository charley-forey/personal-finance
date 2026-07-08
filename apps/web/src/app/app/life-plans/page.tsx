'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function LifePlansPage() {
  const { data: plans, refetch } = useQuery({ queryKey: ['life-plans'], queryFn: () => api.lifePlans() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', planType: 'home', targetDate: '' });

  const create = async () => {
    await api.createLifePlan(form);
    setShowForm(false);
    refetch();
  };

  return (
    <div>
      <PageHeader title="Life Plans" description="Home, college, wedding, and major life goals" actions={
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm">{showForm ? 'Cancel' : 'New Plan'}</button>
      } />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <input placeholder="Plan name" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.planType} onChange={(e) => setForm({ ...form, planType: e.target.value })}>
              <option value="home">Home</option><option value="college">College</option><option value="wedding">Wedding</option><option value="car">Car</option><option value="sabbatical">Sabbatical</option><option value="custom">Custom</option>
            </select>
            <input type="date" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </div>
          <button onClick={create} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium">Create</button>
        </Card>
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
