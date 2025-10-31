<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/ui/Navbar.vue'
const route = useRoute()
</script>

<template>
  <div class="min-h-full">
    <Navbar />
    <main :class="['pt-16']" aria-live="polite">
      <RouterView :key="route.fullPath" />
    </main>
  </div>
</template>
