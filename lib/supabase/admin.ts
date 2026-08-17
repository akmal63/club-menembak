import { createClient } from '@supabase/supabase-js'

// Client dengan hak administratif (service role).
// PERINGATAN: Hanya boleh dipakai di kode server (Server Action / Route Handler).
// Service role key mem-bypass RLS, jadi JANGAN pernah dipakai di komponen client.
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY belum diatur di environment variables.'
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
