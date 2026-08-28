import { Topbar } from '@/components/shell/topbar';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
export default function AdminPage() { return <><Topbar title="관리자 설정" /><div className="content"><PageHeader title="관리자 설정" description="기준 데이터와 접근 정책을 관리합니다." /><Panel title="관리자 기능"><p className="muted">관리자 설정 화면은 다음 단계에서 연결됩니다.</p></Panel></div></>; }
