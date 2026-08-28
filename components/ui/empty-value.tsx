type EmptyValueProps = { reasonCode: string; title?: string };

export function EmptyValue({ reasonCode, title = '계산 불가' }: EmptyValueProps) {
  return <span className="empty-value" title={title}><span aria-hidden="true">—</span><span className="empty-value__reason">{reasonCode}</span></span>;
}
