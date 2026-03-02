import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase admin client using Service Role Key.
 * NEVER import this in client components — it bypasses all RLS.
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('[supabase-admin] Missing SUPABASE_URL env var')
  if (!serviceKey) throw new Error('[supabase-admin] Missing SUPABASE_SERVICE_ROLE_KEY env var')

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
