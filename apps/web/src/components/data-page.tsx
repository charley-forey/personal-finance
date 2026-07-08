'use client';

import { useEffect, useState, ReactNode } from 'react';
import { PageHeader, Card } from '@/components/app-shell';
import { setAuthToken } from '@/lib/api';

interface DataPageProps {
  title: string;
  description?: string;
  load: () => Promise<unknown>;
  render: (data: unknown) => ReactNode;
  actions?: ReactNode;
}

export function DataPage({ title, description, load, render, actions }: DataPageProps) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pf_token');
    if (token) setAuthToken(token);
    load()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [load]);

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <PageHeader title={title} description={description} />
        {actions}
      </div>
      {loading && <p className="text-muted">Loading...</p>}
      {error && <Card className="border-danger/50"><p className="text-danger">{error}</p></Card>}
      {!loading && !error && data !== null && render(data)}
    </div>
  );
}

export function JsonTable({ data }: { data: unknown[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <Card><p className="text-muted text-sm">No data yet. Link accounts or add records.</p></Card>;
  }
  const keys = Object.keys(data[0] as object).slice(0, 6);
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              {keys.map((k) => (
                <th key={k} className="text-left py-2 px-3 text-muted font-medium">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-card-border/50">
                {keys.map((k) => (
                  <td key={k} className="py-2 px-3 tabular-nums">
                    {String((row as Record<string, unknown>)[k] ?? '—').slice(0, 40)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
