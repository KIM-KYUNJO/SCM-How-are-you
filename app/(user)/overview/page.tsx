import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { KpiCard } from '@/components/ui/kpi-card';
import { Panel } from '@/components/ui/panel';
import { Badge } from '@/components/ui/badge';
import { InsightBanner } from '@/components/ui/insight-banner';
export default function OverviewPage() { return <><Topbar title="전체 현황" /><div className="content"><PageHeader title="월간 발주계획 현황" description="주요 공급망 지표와 예외 상태를 한 화면에서 확인합니다." /><div className="kpi-grid"><KpiCard label="수요 확정률" value={{ value: '92%' }} description="전월 대비 +4.2%" status="SAFE" /><KpiCard label="평균 Lead Time" value={{ value: 18, reasonCode: undefined }} description="일 기준" /><KpiCard label="Stockout Risk" value={{ value: 3 }} description="주의 품목" status="WARNING" /><KpiCard label="발주량 계산" value={{ value: null, reasonCode: 'MASTER_DATA_MISSING' }} status="CALCULATION_UNAVAILABLE" /></div><div className="grid grid-2" style={{ marginTop: 16 }}><Panel title="운영 인사이트" description="자동 요약"><InsightBanner>이번 달 예외 품목 3건을 우선 검토하세요.</InsightBanner></Panel><Panel title="시스템 상태" description="데이터 품질"><Badge status="SAFE" /> 기준 데이터 연결 정상</Panel></div></div></>; }
