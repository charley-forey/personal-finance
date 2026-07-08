'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Card } from '@/components/app-shell';
import { PageError, PageLoading } from '@/components/page-states';
import { Badge, Button, EmptyState, Select } from '@/components/ui';
import { api, formatCurrency, type PnlData } from '@/lib/api';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString('en-US', { month: 'long' }),
}));

function PnlGrid({ data, yoyHint }: { data: PnlData; yoyHint?: string }) {
  const cellMap = new Map(data.cells.map((c) => [`${c.rowKey}:${c.columnKey}`, c.value]));

  return (
    <Card>
      {yoyHint && (
        <p className="text-xs text-muted mb-4 rounded-lg bg-white/5 px-3 py-2">{yoyHint}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left py-2 px-3">Line Item</th>
              {data.structure.columns.map((col) => (
                <th key={col} className="text-right py-2 px-3 text-muted">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.structure.rows.map((row) => (
              <tr key={row} className="border-b border-card-border/50">
                <td className="py-2 px-3 font-medium">{row}</td>
                {data.structure.columns.map((col) => (
                  <td key={col} className="py-2 px-3 text-right tabular-nums">
                    {cellMap.has(`${row}:${col}`)
                      ? formatCurrency(parseFloat(cellMap.get(`${row}:${col}`)!))
                      : '—'}
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

function cellTotal(cells: PnlData['cells'], rowKey: string, columnKey: string) {
  const val = cells.find((c) => c.rowKey === rowKey && c.columnKey === columnKey)?.value;
  return val ? parseFloat(val) : 0;
}

export default function PnlPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(String(currentMonth));
  const qc = useQueryClient();

  const yearOptions = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
    [currentYear],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['pnl', year, month],
    queryFn: () => api.pnl(parseInt(year, 10), parseInt(month, 10)),
  });

  const priorYear = parseInt(year, 10) - 1;
  const { data: priorData } = useQuery({
    queryKey: ['pnl', String(priorYear), month],
    queryFn: () => api.pnl(priorYear, parseInt(month, 10)),
    enabled: Boolean(data),
  });

  const closePeriod = useMutation({
    mutationFn: () => api.closePnl(data!.period.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pnl', year, month] }),
  });

  const yoyHint = useMemo(() => {
    if (!data || !priorData) return undefined;
    const currentActual = cellTotal(data.cells, 'Net Income', 'Actual');
    const priorActual = cellTotal(priorData.cells, 'Net Income', 'Actual');
    if (currentActual === 0 && priorActual === 0) return undefined;
    if (priorActual === 0) return `Net Income YoY: ${formatCurrency(currentActual)} (no prior-year data)`;
    const pct = ((currentActual - priorActual) / Math.abs(priorActual)) * 100;
    const dir = pct >= 0 ? 'up' : 'down';
    return `Net Income YoY: ${formatCurrency(currentActual)} vs ${formatCurrency(priorActual)} (${dir} ${Math.abs(pct).toFixed(1)}%)`;
  }, [data, priorData]);

  const periodLabel = `${MONTHS.find((m) => m.value === month)?.label} ${year}`;

  return (
    <div>
      <PageHeader
        title="Monthly P&L"
        description="Budget vs Actual vs Variance — spreadsheet-style tracker"
        actions={
          data?.period.status !== 'closed' ? (
            <Button
              variant="secondary"
              disabled={!data || closePeriod.isPending}
              onClick={() => closePeriod.mutate()}
            >
              {closePeriod.isPending ? 'Closing...' : 'Close Period'}
            </Button>
          ) : (
            <Badge variant="success">Period closed</Badge>
          )
        }
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          label="Year"
          options={yearOptions}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Select
          label="Month"
          options={MONTHS}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {error && <PageError message={error.message} />}

      {isLoading && <PageLoading variant="table" count={6} className="mb-6" />}

      {!isLoading && !error && !data && (
        <EmptyState
          title="No P&L data"
          description={`No profit and loss data available for ${periodLabel}.`}
        />
      )}

      {data && <PnlGrid data={data} yoyHint={yoyHint} />}
    </div>
  );
}
