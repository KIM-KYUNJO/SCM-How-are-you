import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
export default function SupplyPage() { return <><Topbar title="재고·공급" /><div className="content"><PageHeader title="재고·공급" description="공급망 입력과 입고 상태를 관리합니다." /><Panel title="공급 데이터 준비 상태"><p className="muted">공급 데이터 화면은 다음 단계에서 연결됩니다.</p></Panel></div></>; }
