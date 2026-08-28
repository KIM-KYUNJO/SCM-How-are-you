import 'server-only';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type AppRole = 'ADMIN' | 'USER';
export type AppUser = { user_id: string; email: string; name: string | null; department: string | null; role: AppRole; active: boolean };

export async function getRole(): Promise<AppRole | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.schema('core').from('app_user').select('role, active').eq('user_id', user.id).maybeSingle();
  return data?.active ? data.role as AppRole : null;
}

export async function requireUser(): Promise<{ user: User; appUser: AppUser }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  const { data: appUser, error } = await supabase.schema('core').from('app_user').select('user_id, email, name, department, role, active').eq('user_id', user.id).single();
  if (error || !appUser?.active) throw new Error('INACTIVE_USER');
  return { user, appUser: appUser as AppUser };
}

export async function requireAdmin() {
  const result = await requireUser();
  if (result.appUser.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return result;
}
