import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

/**
 * Lazily-created Supabase client. This is the ONLY place in the codebase that
 * imports the Supabase SDK directly; everything else flows through the data
 * source / repository abstraction, so the backend can be replaced wholesale.
 */
let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return client
}
