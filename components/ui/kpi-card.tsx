import type { ReactNode } from 'react';
import { Badge, type Status } from './badge';
import { EmptyValue } from './empty-value';

type KPIValue = { value: string | number | null; reasonCode?: string };
export function KpiCard({ label, value, description, status }: { label: string; value: KPIValue; description?: string; status?: Status }) {
  const unavailable = value.value === null || value.reasonCode;
  return <article className="panel kpi-card"><div className="kpi-card__label">{label}</div><div className="kpi-card__value">{unavailable ? <EmptyValue reasonCode={value.reasonCode ?? 'CALCULATION_UNAVAILABLE'} /> : value.value}</div>{description && <div className="kpi-card__description">{description}</div>}{status && <div className="kpi-card__description"><Badge status={status} /></div>}</article>;
}
