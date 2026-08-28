import type { ReactNode } from 'react';
export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) { return <div className="page-heading"><div><h2>{title}</h2><p>{description}</p></div>{actions && <div className="button-row">{actions}</div>}</div>; }
