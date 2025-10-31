import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export type AlertType = 'success' | 'error' | 'info'
export interface AppAlert {
  type: AlertType
  message: string
  id?: string
}

// PUBLIC_INTERFACE
export const useAuthStore = defineStore('auth', () => {
  /** This store manages Supabase session, Google OAuth, and a simple global alert. */
  const user = ref<import('@supabase/supabase-js').User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const alert = ref<AppAlert | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    if (initialized.value) return
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to initialize auth'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function signInWithGoogle(redirectTo?: string) {
    error.value = null
    loading.value = true
    try {
      const siteUrl = window.location.origin
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || siteUrl + '/app',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (authError) throw authError
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      error.value = msg
      setAlert({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    loading.value = true
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      setAlert({ type: 'success', message: 'Signed out.' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign-out failed'
      setAlert({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  function setAlert(a: AppAlert | null) {
    alert.value = a ? { id: crypto.randomUUID(), ...a } : null
    if (a) {
      // Auto-clear after 4s
      setTimeout(() => {
        if (alert.value?.id === a.id) alert.value = null
      }, 4000)
    }
  }

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    initialize,
    signInWithGoogle,
    signOut,
    alert,
    setAlert,
  }
})
