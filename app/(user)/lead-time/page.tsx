import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { DataTable, type DataColumn } from '@/components/ui/data-table';
import { Badge, type Status } from '@/components/ui/badge';
import { EmptyValue } from '@/components/ui/empty-value';

type LeadTimeRow = { id: string; supplier: string; region: string; leadTime: number | null; status: Status; reason?: string };
const rows: LeadTimeRow[] = [{ id: '1', supplier: 'Supplier A', region: '상해', leadTime: 18, status: 'SAFE' }, { id: '2', supplier: 'Supplier B', region: '심천', leadTime: 27, status: 'WARNING' }, { id: '3', supplier: 'Supplier C', region: '베트남', leadTime: null, reason: 'LEAD_TIME_MISSING', status: 'CALCULATION_UNAVAILABLE' }];
const columns: DataColumn<LeadTimeRow>[] = [{ key: 'supplier', header: 'Supplier' }, { key: 'region', header: '공급 지역' }, { key: 'leadTime', header: 'Lead Time (일)', className: 'num', render: (row) => row.leadTime === null ? <EmptyValue reasonCode={row.reason ?? 'CALCULATION_UNAVAILABLE'} /> : row.leadTime }, { key: 'status', header: '상태', render: (row) => <Badge status={row.status} /> }];
export default function LeadTimePage() { return <><Topbar title="Lead Time 분석" /><div className="content"><PageHeader title="Lead Time 분석" description="Supplier·공급지역별 발주부터 입고까지의 소요일을 비교합니다." /><Panel title="Supplier별 Lead Time" description="기준월 2026.09"><DataTable columns={columns} rows={rows} /></Panel></div></>; }
