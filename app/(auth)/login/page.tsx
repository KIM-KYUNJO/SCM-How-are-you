import { LoginForm } from './login-form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = params.next?.startsWith('/') && !params.next.startsWith('//') ? params.next : '/overview';
  return <main className="content"><section className="panel" style={{ maxWidth: 420, margin: '15vh auto' }}><div className="eyebrow">SCM CONTROL</div><h1>로그인</h1><p className="muted">SCM 운영 콘솔에 접속합니다.</p><LoginForm next={next} /></section></main>;
}
