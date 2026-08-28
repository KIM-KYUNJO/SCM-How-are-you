'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

async function updateUser(userId: string, patch: { role?: 'ADMIN' | 'USER'; active?: boolean }) {
  const { user } = await requireAdmin();
  if (user.id === userId) throw new Error('SELF_ADMIN_MUTATION_FORBIDDEN');
  const supabase = await createClient();
  const { error } = await supabase.schema('core').from('app_user').update(patch).eq('user_id', userId);
  if (error) throw new Error(error.message);
  // The core.audit_log database trigger records role and active changes atomically.
  revalidatePath('/admin/users');
}

export async function changeRole(formData: FormData) {
  const role = String(formData.get('role'));
  if (role !== 'ADMIN' && role !== 'USER') throw new Error('INVALID_ROLE');
  await updateUser(String(formData.get('userId')), { role });
}

export async function changeActive(formData: FormData) {
  await updateUser(String(formData.get('userId')), { active: String(formData.get('active')) === 'true' });
}
