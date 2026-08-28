'use client';
import { useActionState } from 'react';
import { signIn, type LoginState } from './actions';
export function LoginForm({ next }: { next: string }) { const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {}); return <form action={action} className="form-stack"><input type="hidden" name="next" value={next} /><label>이메일<input name="email" type="email" autoComplete="email" required /></label><label>비밀번호<input name="password" type="password" autoComplete="current-password" required /></label>{state.error && <p role="alert" className="text-danger">{state.error}</p>}<button className="button primary" disabled={pending}>{pending ? '로그인 중…' : '로그인'}</button></form>; }
