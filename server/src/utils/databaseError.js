import { HttpError } from './HttpError.js';

/**
 * Convert a Supabase/PostgREST error into a safe HttpError.
 * The raw error is logged on the server but never sent to the client.
 */
export function databaseError(error, context) {
  console.error(`[db] ${context}:`, {
    code: error?.code,
    message: error?.message,
    hint: error?.hint,
  });

  // 42501 = insufficient privilege, PGRST301 = JWT/key problem
  if (error?.code === '42501' || error?.code === 'PGRST301') {
    return new HttpError(500, 'The server is not allowed to read this data. Check the database grants and RLS policies.');
  }

  return new HttpError(502, 'The database did not respond as expected. Try again shortly.');
}
