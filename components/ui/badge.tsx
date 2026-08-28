import type { ReactNode } from 'react';

export type Status = 'SAFE' | 'WARNING' | 'CRITICAL' | 'CALCULATION_UNAVAILABLE';
export function Badge({ status, children }: { status: Status; children?: ReactNode }) {
  return <span className={`badge badge--${status.toLowerCase().replaceAll('_', '-')}`}>{children ?? status}</span>;
}
