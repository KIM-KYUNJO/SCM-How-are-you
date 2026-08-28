import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
export default function AuditPage() { return <><Topbar title="권한·감사" /><div className="content"><PageHeader title="권한·감사" description="사용자 권한과 변경 이력을 확인합니다." /><Panel title="감사 로그"><p className="muted">감사 로그는 다음 단계에서 연결됩니다.</p></Panel></div></>; }
