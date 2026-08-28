import type { ReactNode } from 'react';
export type DataColumn<T> = { key: string; header: string; className?: string; render?: (row: T) => ReactNode };
export function DataTable<T extends { id: string | number }>({ columns, rows, empty = '표시할 데이터가 없습니다.' }: { columns: DataColumn<T>[]; rows: T[]; empty?: string }) {
  return <div className="data-table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th className={column.className} key={column.key}>{column.header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.id}>{columns.map((column) => <td className={column.className} key={column.key}>{column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}</td>)}</tr>) : <tr><td colSpan={columns.length}>{empty}</td></tr>}</tbody></table></div>;
}
