import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/core/config/supabase'

/**
 * Authentication state backed by Supabase Auth.
 *
 * The admin panel is gated to users whose `profiles.role = 'admin'`, which is
 * exactly what the database RLS policies (`public.is_admin()`) check. Signing in
 * here attaches the JWT to every Supabase request, so the data sources can read
 * across all tables.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const role = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => !!session.value)
  const isAdmin = computed(() => role.value === 'admin')

  async function loadRole(): Promise<void> {
    if (!user.value) {
      role.value = null
      return
    }
    const { data } = await getSupabaseClient()
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()
    role.value = (data?.role as string | undefined) ?? null
  }

  /** Restore any persisted session on app start and subscribe to changes. */
  async function init(): Promise<void> {
    const db = getSupabaseClient()
    const { data } = await db.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    await loadRole()

    db.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
      void loadRole()
    })
    ready.value = true
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const db = getSupabaseClient()
      const { data, error: signInError } = await db.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      session.value = data.session
      user.value = data.user
      await loadRole()

      if (!isAdmin.value) {
        await db.auth.signOut()
        session.value = null
        user.value = null
        role.value = null
        throw new Error('This account does not have admin access.')
      }
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sign in failed.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function signOut(): Promise<void> {
    await getSupabaseClient().auth.signOut()
    session.value = null
    user.value = null
    role.value = null
  }

  return { user, session, role, loading, error, ready, isAuthenticated, isAdmin, init, signIn, signOut }
})
