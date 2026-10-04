import { supabasePublic } from '../config/supabase.js';

/** Cheap query that proves the database is reachable (also counts as activity). */
export async function checkDatabase() {
  const started = Date.now();
  const { error } = await supabasePublic
    .from('profiles')
    .select('id', { head: true, count: 'exact' })
    .eq('is_active', true);

  return { ok: !error, latencyMs: Date.now() - started };
}
