'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export type LoginState = { error?: string };
export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> { const email = String(formData.get('email') ?? '').trim(); const password = String(formData.get('password') ?? ''); const next = safeNext(String(formData.get('next') ?? '/overview')); const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) return { error: '이메일 또는 비밀번호를 확인해주세요.' }; const { data: { user } } = await supabase.auth.getUser(); if (user) await supabase.schema('core').from('app_user').update({ last_login_at: new Date().toISOString() }).eq('user_id', user.id); redirect(next); }
function safeNext(next: string) { return next.startsWith('/') && !next.startsWith('//') ? next : '/overview'; }


