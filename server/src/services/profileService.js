import { supabasePublic } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';
import { HttpError } from '../utils/HttpError.js';

const PROFILE_COLUMNS = [
  'id', 'honorific', 'full_name', 'title', 'headline', 'short_intro', 'about',
  'background', 'career_objectives', 'age', 'location', 'email', 'phone',
  'github_url', 'linkedin_url', 'website_url', 'photo_url', 'cv_url', 'updated_at',
].join(', ');

export async function getActiveProfile() {
  const { data, error } = await supabasePublic
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) throw databaseError(error, 'getActiveProfile');
  if (!data) throw new HttpError(404, 'No active profile found. Run database/schema.sql to create one.');
  return data;
}
