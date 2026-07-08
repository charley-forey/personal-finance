'use client';

import { useCallback } from 'react';
import { DataPage } from '@/components/data-page';
import { Card } from '@/components/app-shell';
import { api, formatCurrency } from '@/lib/api';

export default function PnlPage() {
  const now = new Date();
  const load = useCallback(
    () => api.pnl(now.getFullYear(), now.getMonth() + 1),
    [now.getFullYear(), now.getMonth()],
  );

  return (
    <DataPage
      title="Monthly P&L"
      description="Budget vs Actual vs Variance — spreadsheet-style tracker"
      load={load}
      render={(data) => {
        const pnl = data as { structure: { rows: string[]; columns: string[] }; cells: Array<{ rowKey: string; columnKey: string; value: string }> };
        const cellMap = new Map(pnl.cells.map((c) => [`${c.rowKey}:${c.columnKey}`, c.value]));
        return (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left py-2 px-3">Line Item</th>
                    {pnl.structure.columns.map((col) => (
                      <th key={col} className="text-right py-2 px-3 text-muted">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pnl.structure.rows.map((row) => (
                    <tr key={row} className="border-b border-card-border/50">
                      <td className="py-2 px-3 font-medium">{row}</td>
                      {pnl.structure.columns.map((col) => (
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
      }}
    />
  );
}
