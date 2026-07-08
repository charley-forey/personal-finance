'use client';

import { useMemo, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input, Select, StatCard } from '@/components/ui';
import { api, formatCurrency } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function EquityPage() {
  const { data: grants, isLoading, refetch } = useQuery({ queryKey: ['equity'], queryFn: () => api.equity() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: '', grantType: 'rsu', totalShares: '', vestedShares: '', currentFmv: '' });
  const [creating, setCreating] = useState(false);

  const totalValue = useMemo(
    () =>
      (grants ?? []).reduce((sum, g) => {
        const vested = parseFloat(g.vestedShares ?? '0');
        const fmv = parseFloat(g.currentFmv ?? '0');
        return sum + vested * fmv;
      }, 0),
    [grants],
  );

  const create = async () => {
    setCreating(true);
    try {
      await api.createEquityGrant(form);
      setShowForm(false);
      refetch();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Equity Compensation"
        description="RSUs, options, and vesting schedules"
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Grant'}
          </Button>
        }
      />

      {isLoading && <PageLoading variant="cards" count={2} className="mb-6" />}

      {!isLoading && (grants?.length ?? 0) > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCard title="Grants" value={String(grants?.length ?? 0)} />
          <StatCard title="Total Vested Value" value={formatCurrency(totalValue)} />
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Company" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <Select
              options={[
                { value: 'rsu', label: 'RSU' },
                { value: 'iso', label: 'ISO' },
                { value: 'nso', label: 'NSO' },
                { value: 'espp', label: 'ESPP' },
              ]}
              value={form.grantType}
              onChange={(e) => setForm({ ...form, grantType: e.target.value })}
            />
            <Input type="number" placeholder="Total shares" value={form.totalShares} onChange={(e) => setForm({ ...form, totalShares: e.target.value })} />
            <Input type="number" placeholder="Vested shares" value={form.vestedShares} onChange={(e) => setForm({ ...form, vestedShares: e.target.value })} />
            <Input type="number" placeholder="Current FMV" value={form.currentFmv} onChange={(e) => setForm({ ...form, currentFmv: e.target.value })} />
          </div>
          <Button className="mt-4" onClick={create} disabled={creating}>
            {creating ? 'Saving…' : 'Save'}
          </Button>
        </Card>
      )}

      {!isLoading && grants?.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No equity grants"
          description="Add RSUs, stock options, or ESPP grants to track vesting and value."
          action={
            <Button size="sm" onClick={() => setShowForm(true)}>
              Add Grant
            </Button>
          }
        />
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
