import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { DataTable, type DataColumn } from '@/components/ui/data-table';
import { Badge, type Status } from '@/components/ui/badge';
import { EmptyValue } from '@/components/ui/empty-value';
import { AlertRow } from '@/components/ui/alert-row';
type RiskRow = { id: string; item: string; stock: number | null; demand: number | null; status: Status; reason?: string };
const rows: RiskRow[] = [{ id: '1', item: 'Camera Body A', stock: 18, demand: 32, status: 'CRITICAL' }, { id: '2', item: 'Lens Kit B', stock: 45, demand: 48, status: 'WARNING' }, { id: '3', item: 'Accessory C', stock: null, demand: null, status: 'CALCULATION_UNAVAILABLE', reason: 'DEMAND_NOT_CONFIRMED' }];
const columns: DataColumn<RiskRow>[] = [{ key: 'item', header: '품목' }, { key: 'stock', header: '현재 재고', className: 'num', render: (row) => row.stock === null ? <EmptyValue reasonCode={row.reason ?? 'CALCULATION_UNAVAILABLE'} /> : row.stock }, { key: 'demand', header: '확정 수요', className: 'num', render: (row) => row.demand === null ? <EmptyValue reasonCode={row.reason ?? 'CALCULATION_UNAVAILABLE'} /> : row.demand }, { key: 'status', header: '상태', render: (row) => <Badge status={row.status} /> }];
export default function StockoutRiskPage() { return <><Topbar title="Stockout Risk" /><div className="content"><PageHeader title="Stockout Risk" description="재고와 확정 수요를 비교해 품절 위험을 우선순위로 보여줍니다." /><AlertRow status="CRITICAL">위험 품목은 공급 일정과 대체 가능 재고를 함께 검토해야 합니다.</AlertRow><div style={{ marginTop: 16 }}><Panel title="위험 품목 목록" description="계산 불가 값은 원인 코드와 함께 표시"><DataTable columns={columns} rows={rows} /></Panel></div></div></>; }
