<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

function goApp() {
  router.push('/app')
}
async function google() {
  const redirect = (route.query.redirect as string) || '/app'
  await auth.signInWithGoogle(window.location.origin + redirect)
}
</script>

<template>
  <section class="gradient-hero">
    <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-24 sm:grid-cols-2">
      <div>
        <h1 class="text-3xl font-extrabold text-text sm:text-4xl">Discover films with elegance</h1>
        <p class="mt-4 text-secondary">
          Search, explore trending and featured movies from TMDB, and curate your personal list—
          all with a refined Royal Purple experience.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <Button @click="goApp">Open the App</Button>
          <Button v-if="!auth.isAuthenticated" variant="secondary" @click="google">Sign in with Google</Button>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-video w-full rounded-2xl bg-white/60 shadow-soft ring-1 ring-purple-200/50"></div>
      </div>
    </div>
  </section>
</template>
