import { supabasePublic } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';

export async function listEducation() {
  const { data, error } = await supabasePublic
    .from('education')
    .select(
      'id, institution, degree, field_of_study, location, start_year, end_year, status, description, highlights, is_placeholder',
    )
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('end_year', { ascending: false, nullsFirst: true });

  if (error) throw databaseError(error, 'listEducation');
  return data ?? [];
}
