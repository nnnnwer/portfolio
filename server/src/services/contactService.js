import { supabaseAdmin } from '../config/supabase.js';
import { databaseError } from '../utils/databaseError.js';

/**
 * Stores a validated contact message. Uses the secret-key client because the
 * contact_messages table has no public RLS policies.
 */
export async function saveContactMessage({ name, email, subject, message, userAgent }) {
  const { error } = await supabaseAdmin.from('contact_messages').insert({
    name,
    email,
    subject,
    message,
    user_agent: userAgent ? userAgent.slice(0, 500) : null,
  });

  if (error) throw databaseError(error, 'saveContactMessage');
}
