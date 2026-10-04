import { supabasePublic } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';

export async function listExperience() {
  const { data, error } = await supabasePublic
    .from('experience')
    .select(
      'id, role, organization, location, employment_type, start_date, end_date, is_current, description, highlights, is_placeholder',
    )
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false, nullsFirst: false });

  if (error) throw databaseError(error, 'listExperience');
  return data ?? [];
}
