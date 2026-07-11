import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  /** When mobilePresentation is `priority`, include this column on small screens. */
  priority?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
  /** Mobile layout strategy. Default `cards` shows stacked cards below md. */
  mobilePresentation?: 'scroll' | 'cards' | 'priority';
  stickyHeader?: boolean;
}

function cellValue<T>(col: DataTableColumn<T>, row: T, index: number): ReactNode {
  if (col.render) return col.render(row, index);
  return String((row as Record<string, unknown>)[col.key] ?? '');
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available.',
  className,
  mobilePresentation = 'cards',
  stickyHeader = true,
}: DataTableProps<T>) {
  const priorityCols = columns.filter((c) => c.priority);
  const mobileCols = priorityCols.length > 0 ? priorityCols : columns.slice(0, 3);

  return (
    <div className={clsx('rounded-xl border border-card-border', className)}>
      {/* Mobile card / priority list */}
      {mobilePresentation !== 'scroll' && (
        <ul className="divide-y divide-card-border md:hidden">
          {data.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</li>
          ) : (
            data.map((row, index) => (
              <li key={keyExtractor(row, index)} className="space-y-2 px-4 py-3">
                {mobilePresentation === 'cards'
                  ? columns.map((col) => (
                      <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                        <span className="text-xs text-muted shrink-0">{col.header}</span>
                        <span className={clsx('text-right text-foreground', col.className)}>
                          {cellValue(col, row, index)}
                        </span>
                      </div>
                    ))
                  : mobileCols.map((col) => (
                      <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                        <span className="text-xs text-muted shrink-0">{col.header}</span>
                        <span className={clsx('text-right text-foreground', col.className)}>
                          {cellValue(col, row, index)}
                        </span>
                      </div>
                    ))}
              </li>
            ))
          )}
        </ul>
      )}

      {/* Desktop / scroll table */}
      <div
        className={clsx(
          'overflow-x-auto',
          mobilePresentation !== 'scroll' && 'hidden md:block',
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-card">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted',
                    stickyHeader && 'sticky top-0 bg-card',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  className="border-b border-card-border/50 last:border-b-0 hover:bg-white/[0.02]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={clsx('px-4 py-3 text-foreground', col.className)}>
                      {cellValue(col, row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
