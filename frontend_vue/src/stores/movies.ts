import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './auth'

export interface MovieRecord {
  id: string
  user_id: string
  title: string
  tmdb_id?: number | null
  notes?: string | null
  created_at?: string
}

// PUBLIC_INTERFACE
export const useMoviesStore = defineStore('movies', () => {
  const auth = useAuthStore()
  const items = ref<MovieRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const userId = computed(() => auth.user?.id)

  // PUBLIC_INTERFACE
  async function fetchAll() {
    if (!userId.value) {
      items.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: qErr } = await supabase
        .from('movies')
        .select('*')
        .eq('user_id', userId.value)
        .order('created_at', { ascending: false })
      if (qErr) throw qErr
      items.value = (data ?? []) as MovieRecord[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load your movies'
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function add(movie: Omit<MovieRecord, 'id' | 'user_id' | 'created_at'>) {
    if (!userId.value) return
    const optimistic: MovieRecord = {
      id: `optimistic-${crypto.randomUUID()}`,
      user_id: userId.value,
      title: movie.title,
      tmdb_id: movie.tmdb_id ?? null,
      notes: movie.notes ?? null,
      created_at: new Date().toISOString(),
    }
    items.value = [optimistic, ...items.value]
    try {
      const { data, error: insErr } = await supabase
        .from('movies')
        .insert({
          user_id: userId.value,
          title: movie.title,
          tmdb_id: movie.tmdb_id ?? null,
          notes: movie.notes ?? null,
        })
        .select()
        .single()
      if (insErr) throw insErr
      const rec = (data as MovieRecord)
      items.value = items.value.map((it) => (it.id === optimistic.id ? rec : it))
      return rec
    } catch (e) {
      // rollback
      items.value = items.value.filter((it) => it.id !== optimistic.id)
      throw (e instanceof Error ? e : new Error('Add failed'))
    }
  }

  // PUBLIC_INTERFACE
  async function remove(id: string) {
    const prev = [...items.value]
    items.value = items.value.filter((it) => it.id !== id)
    try {
      const { error: delErr } = await supabase.from('movies').delete().eq('id', id)
      if (delErr) throw delErr
    } catch (e) {
      // rollback
      items.value = prev
      throw (e instanceof Error ? e : new Error('Delete failed'))
    }
  }

  // PUBLIC_INTERFACE
  async function update(id: string, patch: Partial<Pick<MovieRecord, 'title' | 'notes'>>) {
    const prev = [...items.value]
    items.value = items.value.map((it) => (it.id === id ? { ...it, ...patch } : it))
    try {
      const { data, error: upErr } = await supabase
        .from('movies')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (upErr) throw upErr
      const rec = (data as MovieRecord)
      items.value = items.value.map((it) => (it.id === id ? rec : it))
    } catch (e) {
      items.value = prev
      throw (e instanceof Error ? e : new Error('Update failed'))
    }
  }

  return { items, loading, error, fetchAll, add, remove, update }
})
