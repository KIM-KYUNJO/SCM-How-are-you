import 'server-only';
import { createClient } from '@/lib/supabase/server';

export async function getTrainDemand() {
  const supabase = await createClient();
  return supabase.schema('core').from('v_train_demand').select('*').order('usage_date');
}

export async function getTestActual() {
  const supabase = await createClient();
  return supabase.schema('core').from('v_test_actual').select('*').order('usage_date');
}
