import type { ReactNode } from 'react';
export function Panel({ title, description, children, className = '' }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`.trim()}>{title && <div className="panel-title"><h3>{title}</h3>{description && <span>{description}</span>}</div>}{children}</section>;
}
