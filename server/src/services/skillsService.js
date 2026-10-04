import { supabasePublic } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';

export async function listSkills() {
  const { data, error } = await supabasePublic
    .from('skills')
    .select('id, name, category, level, display_order, is_placeholder')
    .eq('is_published', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw databaseError(error, 'listSkills');
  return data ?? [];
}
