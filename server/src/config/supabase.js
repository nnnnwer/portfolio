import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const serverOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};

/**
 * Low-privilege client (publishable key). Row Level Security applies, so it
 * can only read rows the public policies allow. Used for every GET endpoint.
 */
export const supabasePublic = createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
  serverOptions,
);

/**
 * Elevated client (secret key). Bypasses RLS. Used ONLY to insert validated
 * contact messages. Never import this into a read path and never expose it.
 */
export const supabaseAdmin = createClient(
  env.supabaseUrl,
  env.supabaseSecretKey,
  serverOptions,
);
