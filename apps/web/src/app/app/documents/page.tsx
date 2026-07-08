'use client';

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Upload } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { Badge, Button, DataTable, EmptyState, Input, Select } from '@/components/ui';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';

const DOCUMENT_TYPES = [
  { value: 'w2', label: 'W-2' },
  { value: '1099', label: '1099' },
  { value: 'statement', label: 'Statement' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'other', label: 'Other' },
];

const currentYear = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 6 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export default function DocumentsPage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ filename: '', taxYear: String(currentYear), documentType: 'other' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.documents(),
  });

  const uploadDocument = async () => {
    const filename = selectedFile?.name ?? form.filename.trim();
    if (!filename) return;

    setUploading(true);
    try {
      let storageKey = `pending/${filename}`;
      if (selectedFile) {
        const { uploadUrl, storageKey: key } = await api.documentUploadUrl(
          selectedFile.name,
          selectedFile.type || 'application/octet-stream',
        );
        storageKey = key;
        await fetch(uploadUrl, {
          method: 'PUT',
          body: selectedFile,
          headers: { 'Content-Type': selectedFile.type || 'application/octet-stream' },
        });
      }

      await api.createDocument({
        filename,
        taxYear: parseInt(form.taxYear, 10),
        documentType: form.documentType,
        storageKey,
      });

      qc.invalidateQueries({ queryKey: ['documents'] });
      setForm({ filename: '', taxYear: String(currentYear), documentType: 'other' });
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setShowForm(false);
    } finally {
      setUploading(false);
    }
  };

  const createDoc = useMutation({
    mutationFn: uploadDocument,
  });

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Tax docs, statements, and receipts"
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Upload Document'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">File</label>
              <input
                ref={fileRef}
                type="file"
                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                  if (file) setForm({ ...form, filename: file.name });
                }}
              />
            </div>
            <Input
              label="Filename"
              placeholder="2024-w2-acme.pdf"
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
            />
            <Select
              label="Tax Year"
              options={TAX_YEARS}
              value={form.taxYear}
              onChange={(e) => setForm({ ...form, taxYear: e.target.value })}
            />
            <Select
              label="Document Type"
              options={DOCUMENT_TYPES}
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
            />
          </div>
          <Button
            className="mt-4"
            disabled={(!form.filename.trim() && !selectedFile) || createDoc.isPending || uploading}
            onClick={() => createDoc.mutate()}
          >
            {uploading || createDoc.isPending ? 'Uploading...' : 'Upload & Save'}
          </Button>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-danger/50">
          <p className="text-danger text-sm">{error.message}</p>
        </Card>
      )}

      {isLoading && <p className="text-muted text-sm">Loading documents...</p>}

      {!isLoading && !error && documents?.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload tax forms, statements, or receipts to keep everything organized."
          action={
            <Button onClick={() => setShowForm(true)}>
              <Upload className="h-4 w-4" />
              Upload your first document
            </Button>
          }
        />
      )}

      {!isLoading && documents && documents.length > 0 && (
        <DataTable
          data={documents}
          keyExtractor={(doc) => doc.id}
          columns={[
            { key: 'filename', header: 'Filename' },
            {
              key: 'documentType',
              header: 'Type',
              render: (doc) => (
                <Badge variant="default">{doc.documentType.replace('_', ' ')}</Badge>
              ),
            },
            {
              key: 'taxYear',
              header: 'Tax Year',
              render: (doc) => doc.taxYear ?? '—',
            },
            {
              key: 'createdAt',
              header: 'Added',
              render: (doc) => (doc.createdAt ? formatDate(doc.createdAt) : '—'),
            },
          ]}
        />
      )}
    </div>
  );
}
