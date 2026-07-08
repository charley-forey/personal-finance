'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, DataTable, EmptyState, Input, Modal, Select, StatCard } from '@/components/ui';
import { api, type ManualAsset } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'collectible', label: 'Collectible' },
  { value: 'other', label: 'Other' },
];

const emptyForm = { assetType: 'real_estate', name: '', currentValue: '' };

export default function AssetsPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ManualAsset | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['manual-assets'],
    queryFn: () => api.manualAssets(),
  });

  const createAsset = useMutation({
    mutationFn: () =>
      api.createManualAsset({
        assetType: form.assetType,
        name: form.name,
        currentValue: parseFloat(form.currentValue),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['manual-assets'] });
      setForm(emptyForm);
      setShowCreate(false);
    },
  });

  const updateAsset = useMutation({
    mutationFn: () =>
      api.updateManualAsset(editing!.id, {
        assetType: form.assetType,
        name: form.name,
        currentValue: parseFloat(form.currentValue),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['manual-assets'] });
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteAsset = useMutation({
    mutationFn: (id: string) => api.deleteManualAsset(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manual-assets'] }),
  });

  function openEdit(asset: ManualAsset) {
    setEditing(asset);
    setForm({
      assetType: asset.assetType,
      name: asset.name,
      currentValue: asset.currentValue ?? '',
    });
  }

  function closeModal() {
    setEditing(null);
    setShowCreate(false);
    setForm(emptyForm);
  }

  const totalValue = (assets ?? []).reduce((sum, a) => sum + parseFloat(String(a.currentValue ?? 0)), 0);

  const modalOpen = showCreate || editing !== null;
  const saving = createAsset.isPending || updateAsset.isPending;

  return (
    <div>
      <PageHeader
        title="Manual Assets"
        description="Real estate, crypto, vehicles, and other holdings not linked via Plaid"
        actions={
          <Button variant={showCreate ? 'secondary' : 'primary'} onClick={() => (showCreate ? closeModal() : setShowCreate(true))}>
            {showCreate ? 'Cancel' : 'Add Asset'}
          </Button>
        }
      />

      {error && <PageError message={error.message} />}

      {isLoading && <PageLoading variant="table" count={4} className="mb-6" />}

      {!isLoading && (assets?.length ?? 0) > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4 max-w-md">
          <StatCard title="Assets" value={String(assets?.length ?? 0)} />
          <StatCard title="Total Value" value={formatCurrency(totalValue)} />
        </div>
      )}

      {!isLoading && !error && assets?.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No manual assets"
          description="Track real estate, crypto, vehicles, and other holdings that aren't synced from your bank."
          action={<Button onClick={() => setShowCreate(true)}>Add your first asset</Button>}
        />
      )}

      {!isLoading && assets && assets.length > 0 && (
        <DataTable
          data={assets}
          keyExtractor={(asset) => asset.id}
          columns={[
            { key: 'name', header: 'Name' },
            {
              key: 'assetType',
              header: 'Type',
              render: (asset) => asset.assetType.replace('_', ' '),
            },
            {
              key: 'currentValue',
              header: 'Value',
              className: 'tabular-nums',
              render: (asset) => formatCurrency(asset.currentValue ?? 0),
            },
            {
              key: 'actions',
              header: '',
              render: (asset) => (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(asset)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deleteAsset.isPending}
                    onClick={() => deleteAsset.mutate(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Asset' : 'Add Asset'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Primary residence"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Select
            label="Asset Type"
            options={ASSET_TYPES}
            value={form.assetType}
            onChange={(e) => setForm({ ...form, assetType: e.target.value })}
          />
          <Input
            label="Current Value"
            type="number"
            placeholder="500000"
            value={form.currentValue}
            onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              disabled={!form.name.trim() || !form.currentValue || saving}
              onClick={() => (editing ? updateAsset.mutate() : createAsset.mutate())}
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
