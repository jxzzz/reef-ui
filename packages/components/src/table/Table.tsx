import { useMemo, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import type { TableColumn, TableProps, TableSortOrder } from './types';
import './table.css';

const alignClass: Record<string, string> = {
  center: 'reef-table__cell--center',
  right: 'reef-table__cell--right',
};

export function Table<T = Record<string, unknown>>({
  columns,
  dataSource,
  rowKey,
  className,
  empty,
}: TableProps<T>) {
  const t = useLocale();
  const [sort, setSort] = useState<{ key: string; order: TableSortOrder } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return dataSource;
    const sorter = columns.find((c) => c.key === sort.key)?.sorter;
    if (!sorter) return dataSource;
    const sorted = [...dataSource].sort(sorter);
    return sort.order === 'desc' ? sorted.reverse() : sorted;
  }, [sort, dataSource, columns]);

  const toggleSort = (col: TableColumn<T>) => {
    if (!col.sorter) return;
    setSort((s) =>
      s?.key === col.key && s.order === 'asc' ? { key: col.key, order: 'desc' } : { key: col.key, order: 'asc' },
    );
  };

  const keyOf = (record: T, index: number) =>
    typeof rowKey === 'function'
      ? rowKey(record, index)
      : rowKey != null
        ? String(record[rowKey])
        : String(index);

  const col = (c: TableColumn<T>, cell?: React.ReactNode) => (
    <td
      key={c.key}
      className={cn('reef-table__cell', (c.align && alignClass[c.align]), c.ellipsis && 'reef-table__cell--ellipsis')}
    >
      {cell}
    </td>
  );

  return (
    <div className={cn('reef-table', className)}>
      <table>
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                aria-sort={
                  c.sorter
                    ? sort?.key === c.key
                      ? sort.order === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
                className={cn('reef-table__cell', (c.align && alignClass[c.align]), c.sorter && 'reef-table__cell--sortable')}
                onClick={() => toggleSort(c)}
              >
                <span className="reef-table__title">
                  {c.title}
                  {c.sorter && (
                    <span
                      className={cn('reef-table__sorter', {
                        'reef-table__sorter--active': sort?.key === c.key,
                      })}
                      aria-hidden="true"
                    >
                      {sort?.key === c.key && sort.order === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((record, i) => (
            <tr key={keyOf(record, i)}>
              {columns.map((c) => col(c, c.render ? c.render(record, i) : (record as Record<string, unknown>)[c.key] as React.ReactNode))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="reef-table__empty">
                {empty ?? t.Table.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
