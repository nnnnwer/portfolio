import { supabasePublic } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';
import { HttpError } from '../utils/HttpError.js';
import { isSlug, isUuid } from '../utils/identifiers.js';

const LIST_COLUMNS = [
  'id', 'slug', 'title', 'summary', 'status', 'year', 'tech_stack',
  'github_url', 'live_url', 'image_url', 'featured', 'is_placeholder',
].join(', ');

const DETAIL_COLUMNS = `${LIST_COLUMNS}, description, role, updated_at`;

export async function listProjects({ featuredOnly = false } = {}) {
  let query = supabasePublic
    .from('projects')
    .select(LIST_COLUMNS)
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (featuredOnly) query = query.eq('featured', true);

  const { data, error } = await query;
  if (error) throw databaseError(error, 'listProjects');
  return data ?? [];
}

/** Accepts either the project's UUID or its slug. */
export async function getProject(idOrSlug) {
  const key = String(idOrSlug ?? '').trim().toLowerCase();
  const column = isUuid(key) ? 'id' : isSlug(key) ? 'slug' : null;

  if (!column) throw new HttpError(404, 'Project not found.');

  const { data, error } = await supabasePublic
    .from('projects')
    .select(DETAIL_COLUMNS)
    .eq('is_published', true)
    .eq(column, key)
    .maybeSingle();

  if (error) throw databaseError(error, 'getProject');
  if (!data) throw new HttpError(404, 'Project not found.');
  return data;
}
