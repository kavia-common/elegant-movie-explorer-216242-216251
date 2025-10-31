<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Grid from '@/components/ui/Grid.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import MovieCard from '@/components/MovieCard.vue'
import YourMoviesPanel from '@/components/YourMoviesPanel.vue'
import { getTrending, getFeatured, searchMovies, type TmdbMovie } from '@/services/tmdb'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'

const trending = ref<TmdbMovie[]>([])
const featured = ref<TmdbMovie[]>([])
const results = ref<TmdbMovie[]>([])
const loadingTrending = ref(false)
const loadingFeatured = ref(false)
const loadingSearch = ref(false)
const query = ref('')

const movies = useMoviesStore()
const auth = useAuthStore()

onMounted(async () => {
  loadingTrending.value = true
  loadingFeatured.value = true
  try {
    trending.value = await getTrending()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load Trending'
    auth.setAlert({ type: 'error', message: msg })
  } finally {
    loadingTrending.value = false
  }
  try {
    featured.value = await getFeatured()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load Featured'
    auth.setAlert({ type: 'error', message: msg })
  } finally {
    loadingFeatured.value = false
  }
  await movies.fetchAll()
})

async function onSearch(q: string, signal?: AbortSignal) {
  try {
    const data = await searchMovies(q, signal)
    results.value = data
  } catch (e) {
    // Ignore abort errors from debounced/aborted searches
    if (e instanceof DOMException && e.name === 'AbortError') {
      // no-op
    } else {
      const msg = e instanceof Error ? e.message : 'Search failed'
      auth.setAlert({ type: 'error', message: msg })
    }
  } finally {
    loadingSearch.value = false
  }
}

function onClear() {
  results.value = []
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 pb-10 pt-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="lg:col-span-9 space-y-8">
        <SearchBar v-model="query" v-model:loading="loadingSearch" @search="onSearch" @clear="onClear" />

        <section v-if="query && results.length">
          <SectionHeader>Search Results</SectionHeader>
          <Grid>
            <MovieCard v-for="m in results" :key="m.id" :movie="m" />
          </Grid>
        </section>
        <section v-else-if="query && loadingSearch" class="flex items-center gap-2 text-secondary">
          <Spinner /><span>Searching...</span>
        </section>
        <section v-else-if="query && !loadingSearch && !results.length">
          <EmptyState>No results found.</EmptyState>
        </section>

        <section>
          <SectionHeader>Trending</SectionHeader>
          <div v-if="loadingTrending" class="flex items-center gap-2 text-secondary"><Spinner /><span>Loading...</span></div>
          <Grid v-else>
            <MovieCard v-for="m in trending" :key="m.id" :movie="m" />
          </Grid>
        </section>

        <section>
          <SectionHeader>Featured</SectionHeader>
          <div v-if="loadingFeatured" class="flex items-center gap-2 text-secondary"><Spinner /><span>Loading...</span></div>
          <Grid v-else>
            <MovieCard v-for="m in featured" :key="m.id" :movie="m" />
          </Grid>
        </section>
      </div>

      <div class="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
        <YourMoviesPanel />
      </div>
    </div>
  </div>
</template>
