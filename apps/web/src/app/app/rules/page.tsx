'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, Button, DataTable, EmptyState, Input, Select } from '@/components/ui';
import { api, type AutomationRule } from '@/lib/api';
import { Bot } from 'lucide-react';

const TRIGGER_TYPES = [
  { value: 'transaction', label: 'Transaction' },
  { value: 'budget_exceeded', label: 'Budget Exceeded' },
  { value: 'balance_low', label: 'Low Balance' },
];

const ACTION_TYPES = [
  { value: 'notify', label: 'Send Notification' },
  { value: 'create_insight', label: 'Create Insight' },
];

export default function RulesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    triggerType: 'transaction',
    actionType: 'notify',
    minAmount: '',
    actionTitle: '',
    actionBody: '',
  });

  const { data: rules, isLoading, error } = useQuery({
    queryKey: ['rules'],
    queryFn: () => api.rules(),
  });

  const createRule = useMutation({
    mutationFn: () =>
      api.createRule({
        name: form.name,
        triggerType: form.triggerType,
        actionType: form.actionType,
        conditions: form.minAmount ? { minAmount: parseFloat(form.minAmount) } : {},
        action: {
          title: form.actionTitle || form.name,
          body: form.actionBody || `Rule "${form.name}" triggered`,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rules'] });
      setForm({ name: '', triggerType: 'transaction', actionType: 'notify', minAmount: '', actionTitle: '', actionBody: '' });
      setShowForm(false);
    },
  });

  const deleteRule = useMutation({
    mutationFn: (id: string) => api.deleteRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  });

  const toggleRule = useMutation({
    mutationFn: (rule: AutomationRule) => api.updateRule(rule.id, { enabled: !rule.enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  });

  return (
    <div>
      <PageHeader
        title="Automation Rules"
        description="Build rules that trigger notifications and insights"
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Rule'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Rule Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Select label="Trigger" options={TRIGGER_TYPES} value={form.triggerType} onChange={(e) => setForm({ ...form, triggerType: e.target.value })} />
            <Select label="Action" options={ACTION_TYPES} value={form.actionType} onChange={(e) => setForm({ ...form, actionType: e.target.value })} />
            <Input label="Min Amount (optional)" type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} />
            <Input label="Notification Title" value={form.actionTitle} onChange={(e) => setForm({ ...form, actionTitle: e.target.value })} />
            <Input label="Notification Body" value={form.actionBody} onChange={(e) => setForm({ ...form, actionBody: e.target.value })} />
          </div>
          <Button className="mt-4" disabled={!form.name.trim() || createRule.isPending} onClick={() => createRule.mutate()}>
            {createRule.isPending ? 'Creating...' : 'Create Rule'}
          </Button>
        </Card>
      )}

      {error && <PageError message={error.message} />}

      {isLoading && <PageLoading variant="table" count={4} className="mb-6" />}

      {!isLoading && rules?.length === 0 && (
        <EmptyState
          icon={Bot}
          title="No automation rules"
          description="Create rules to get notified when transactions match your criteria."
          action={<Button onClick={() => setShowForm(true)}>Create your first rule</Button>}
        />
      )}

      {!isLoading && rules && rules.length > 0 && (
        <DataTable
          data={rules}
          keyExtractor={(r) => r.id}
          columns={[
            { key: 'name', header: 'Name' },
            {
              key: 'triggerType',
              header: 'Trigger',
              render: (r) => <Badge variant="default">{r.triggerType.replace('_', ' ')}</Badge>,
            },
            {
              key: 'actionType',
              header: 'Action',
              render: (r) => <Badge variant="default">{r.actionType.replace('_', ' ')}</Badge>,
            },
            {
              key: 'enabled',
              header: 'Status',
              render: (r) => (
                <Badge variant={r.enabled ? 'success' : 'warning'}>{r.enabled ? 'Active' : 'Disabled'}</Badge>
              ),
            },
            {
              key: 'triggerCount',
              header: 'Runs',
              render: (r) => r.triggerCount ?? 0,
            },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => toggleRule.mutate(r)}>
                    {r.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => deleteRule.mutate(r.id)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
