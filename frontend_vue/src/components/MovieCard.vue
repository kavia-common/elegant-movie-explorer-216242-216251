<script setup lang="ts">
import { computed } from 'vue'
import Button from './ui/Button.vue'
import { imgPoster, movieTitle, type TmdbMovie } from '@/services/tmdb'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ movie: TmdbMovie }>()
const movies = useMoviesStore()
const auth = useAuthStore()

const title = computed(() => movieTitle(props.movie))
const inList = computed(() => movies.items.some((m) => m.tmdb_id === props.movie.id && m.user_id === auth.user?.id))

async function add() {
  try {
    await movies.add({ title: title.value, tmdb_id: props.movie.id, notes: null })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to add movie'
    auth.setAlert({ type: 'error', message: msg })
  }
}

async function remove() {
  const rec = movies.items.find((m) => m.tmdb_id === props.movie.id && m.user_id === auth.user?.id)
  if (!rec) return
  try {
    await movies.remove(rec.id)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to remove movie'
    auth.setAlert({ type: 'error', message: msg })
  }
}
</script>

<template>
  <div class="group relative overflow-hidden rounded-xl border border-purple-200/50 bg-white shadow-sm">
    <img
      :src="imgPoster(movie.poster_path, 'w342')"
      :alt="title"
      class="aspect-[2/3] w-full object-cover"
      loading="lazy"
    />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
      <h3 class="text-sm font-semibold text-white line-clamp-2">{{ title }}</h3>
      <div class="mt-2">
        <Button v-if="!inList" size="sm" variant="primary" class="text-xs" @click="add" aria-label="Add to your movies">Add</Button>
        <Button v-else size="sm" variant="secondary" class="text-xs" @click="remove" aria-label="Remove from your movies">Remove</Button>
      </div>
    </div>
  </div>
</template>
