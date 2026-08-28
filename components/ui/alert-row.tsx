import type { ReactNode } from 'react';
import type { Status } from './badge';
export function AlertRow({ status, children }: { status: Extract<Status, 'WARNING' | 'CRITICAL'>; children: ReactNode }) { return <div className={`alert-row alert-row--${status.toLowerCase()}`} role="alert">{children}</div>; }
