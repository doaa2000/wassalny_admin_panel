/** Strongly-typed access to build-time environment configuration. */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  /** Defaults to mock mode so the app runs with zero backend configuration. */
  useMock: (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false',
} as const
