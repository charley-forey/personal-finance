'use client';

import { useState } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { api, formatCurrency } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function EquityPage() {
  const { data: grants, refetch } = useQuery({ queryKey: ['equity'], queryFn: () => api.equity() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: '', grantType: 'rsu', totalShares: '', vestedShares: '', currentFmv: '' });

  const create = async () => {
    await api.createEquityGrant(form);
    setShowForm(false);
    refetch();
  };

  return (
    <div>
      <PageHeader title="Equity Compensation" description="RSUs, options, and vesting schedules" actions={
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm">{showForm ? 'Cancel' : 'Add Grant'}</button>
      } />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Company" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <select className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.grantType} onChange={(e) => setForm({ ...form, grantType: e.target.value })}>
              <option value="rsu">RSU</option><option value="iso">ISO</option><option value="nso">NSO</option><option value="espp">ESPP</option>
            </select>
            <input type="number" placeholder="Total shares" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.totalShares} onChange={(e) => setForm({ ...form, totalShares: e.target.value })} />
            <input type="number" placeholder="Vested shares" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.vestedShares} onChange={(e) => setForm({ ...form, vestedShares: e.target.value })} />
            <input type="number" placeholder="Current FMV" className="bg-background border border-card-border rounded-lg px-3 py-2" value={form.currentFmv} onChange={(e) => setForm({ ...form, currentFmv: e.target.value })} />
          </div>
          <button onClick={create} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium">Save</button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(grants ?? []).map((g) => {
          const vested = parseFloat(g.vestedShares ?? '0');
          const fmv = parseFloat(g.currentFmv ?? '0');
          return (
            <Card key={g.id}>
              <p className="text-xs text-primary uppercase">{g.grantType}</p>
              <h3 className="font-semibold mt-1">{g.companyName}</h3>
              <p className="text-sm text-muted mt-2">Vested: {vested} shares · Value: {formatCurrency(vested * fmv)}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
