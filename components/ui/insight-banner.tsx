import type { ReactNode } from 'react';
import type { Status } from './badge';
export function InsightBanner({ status = 'SAFE', children }: { status?: Extract<Status, 'SAFE' | 'WARNING'>; children: ReactNode }) { return <div className={`insight-banner insight-banner--${status.toLowerCase()}`}>{children}</div>; }
