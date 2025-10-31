<script setup lang="ts">
import { onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import Button from './ui/Button.vue'
import Spinner from './ui/Spinner.vue'
import EmptyState from './EmptyState.vue'

const movies = useMoviesStore()
const auth = useAuthStore()

onMounted(() => {
  if (auth.isAuthenticated) movies.fetchAll()
})
</script>

<template>
  <section class="card p-4">
    <h3 class="mb-3 text-base font-semibold text-text">Your Movies</h3>
    <div v-if="movies.loading" class="flex items-center gap-2 text-secondary">
      <Spinner /><span>Loading your list...</span>
    </div>
    <div v-else-if="movies.error">
      <div class="text-error">{{ movies.error }}</div>
    </div>
    <ul v-else-if="movies.items.length" class="space-y-2">
      <li v-for="m in movies.items" :key="m.id" class="flex items-center justify-between rounded-lg border border-purple-100 bg-white px-3 py-2">
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-text">{{ m.title }}</p>
          <p v-if="m.notes" class="truncate text-xs text-secondary">{{ m.notes }}</p>
        </div>
        <Button variant="secondary" class="text-xs" @click="movies.remove(m.id)">Remove</Button>
      </li>
    </ul>
    <EmptyState v-else>
      Your list is empty. Use the Add button on movies to save them here.
    </EmptyState>
  </section>
</template>
