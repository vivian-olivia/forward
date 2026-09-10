import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key. Never import this from a
// client component — the service role key bypasses row-level security.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
