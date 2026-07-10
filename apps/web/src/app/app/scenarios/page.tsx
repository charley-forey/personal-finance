'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader, Card } from '@/components/ui';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, Button, DataTable, EmptyState, Input, StatCard } from '@/components/ui';
import { api, formatCurrency, type Scenario } from '@/lib/api';
import { FlaskConical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScenariosPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    months: '12',
    monthlyIncome: '',
    monthlyExpenses: '',
    expenseChangePct: '',
    oneTimeExpense: '',
  });
  const [selectedResult, setSelectedResult] = useState<Scenario | null>(null);

  const { data: scenarios, isLoading, error } = useQuery({
    queryKey: ['scenarios'],
    queryFn: () => api.scenarios(),
  });

  const createScenario = useMutation({
    mutationFn: () =>
      api.createScenario({
        name: form.name,
        scenarioType: 'what_if',
        inputs: {
          months: parseInt(form.months, 10) || 12,
          monthlyIncome: form.monthlyIncome ? parseFloat(form.monthlyIncome) : undefined,
          monthlyExpenses: form.monthlyExpenses ? parseFloat(form.monthlyExpenses) : undefined,
          expenseChangePct: form.expenseChangePct ? parseFloat(form.expenseChangePct) : undefined,
          oneTimeExpense: form.oneTimeExpense ? parseFloat(form.oneTimeExpense) : undefined,
          oneTimeExpenseMonth: form.oneTimeExpense ? 1 : undefined,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scenarios'] });
      setShowForm(false);
      setForm({ name: '', months: '12', monthlyIncome: '', monthlyExpenses: '', expenseChangePct: '', oneTimeExpense: '' });
    },
  });

  const runSimulation = useMutation({
    mutationFn: (id: string) => api.runScenario(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['scenarios'] });
      setSelectedResult(data.scenario);
    },
  });

  const chartData = selectedResult?.resultsJson?.series.map((s) => ({
    month: s.month,
    balance: s.balance,
  })) ?? [];

  return (
    <div>
      <AppPageHeader
        title="Scenario Studio"
        description="What-if simulations for income, expenses, and cash flow"
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Scenario'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Scenario Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Job loss for 3 months" />
            <Input label="Horizon (months)" type="number" value={form.months} onChange={(e) => setForm({ ...form, months: e.target.value })} />
            <Input label="Monthly Income (optional)" type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} />
            <Input label="Monthly Expenses (optional)" type="number" value={form.monthlyExpenses} onChange={(e) => setForm({ ...form, monthlyExpenses: e.target.value })} />
            <Input label="Expense Change % (annual)" type="number" value={form.expenseChangePct} onChange={(e) => setForm({ ...form, expenseChangePct: e.target.value })} />
            <Input label="One-time Expense" type="number" value={form.oneTimeExpense} onChange={(e) => setForm({ ...form, oneTimeExpense: e.target.value })} />
          </div>
          <Button className="mt-4" disabled={!form.name.trim() || createScenario.isPending} onClick={() => createScenario.mutate()}>
            {createScenario.isPending ? 'Creating...' : 'Create Scenario'}
          </Button>
        </Card>
      )}

      {selectedResult?.resultsJson && (
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <StatCard title="Ending Balance" value={formatCurrency(selectedResult.resultsJson.endingBalance)} />
            <StatCard title="Min Balance" value={formatCurrency(selectedResult.resultsJson.minBalance)} />
            <StatCard title="Total Net" value={formatCurrency(selectedResult.resultsJson.totalNet)} />
            <StatCard
              title="Outcome"
              value={selectedResult.resultsJson.success ? 'Sustainable' : 'Shortfall'}
              change={selectedResult.resultsJson.success ? undefined : { value: 'Cash runs negative', trend: 'down' }}
            />
          </div>
          <Card title={`Projection: ${selectedResult.name}`}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {error && <PageError message={error.message} />}

      {isLoading && <PageLoading variant="table" count={4} className="mb-6" />}

      {!isLoading && scenarios?.length === 0 && (
        <EmptyState
          icon={FlaskConical}
          title="No scenarios yet"
          description="Model what-if changes to income and expenses."
          action={<Button onClick={() => setShowForm(true)}>Create a scenario</Button>}
        />
      )}

      {!isLoading && scenarios && scenarios.length > 0 && (
        <DataTable
          data={scenarios}
          keyExtractor={(s) => s.id}
          columns={[
            { key: 'name', header: 'Name' },
            {
              key: 'scenarioType',
              header: 'Type',
              render: (s) => <Badge variant="default">{s.scenarioType.replace('_', ' ')}</Badge>,
            },
            {
              key: 'results',
              header: 'Last Result',
              render: (s) =>
                s.resultsJson ? (
                  <span className="tabular-nums">{formatCurrency(s.resultsJson.endingBalance)}</span>
                ) : (
                  '—'
                ),
            },
            {
              key: 'actions',
              header: '',
              render: (s) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={runSimulation.isPending}
                    onClick={() => runSimulation.mutate(s.id)}
                  >
                    Run
                  </Button>
                  {s.resultsJson && (
                    <Button size="sm" variant="secondary" onClick={() => setSelectedResult(s)}>
                      View
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
