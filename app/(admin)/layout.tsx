import { Sidebar } from '@/components/shell/sidebar';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  try { await requireAdmin(); } catch (error) { if (error instanceof Error && error.message === 'FORBIDDEN') return <main className="content"><section className="panel"><h1>403 Forbidden</h1><p>관리자 권한이 필요합니다.</p></section></main>; return <main className="content"><section className="panel"><h1>로그인이 필요합니다.</h1><p>관리자 계정으로 로그인해주세요.</p></section></main>; }
  return <div className="app-shell"><Sidebar role="ADMIN" /><main className="main">{children}</main></div>;
}
