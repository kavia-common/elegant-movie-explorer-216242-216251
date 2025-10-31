<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import Input from './ui/Input.vue'
import Spinner from './ui/Spinner.vue'

const model = defineModel<string>({ default: '' })
const loading = defineModel<boolean>('loading', { default: false })

let debounceTimer: number | undefined
let controller: AbortController | null = null

// PUBLIC_INTERFACE
const emit = defineEmits<{
  (e: 'search', query: string, signal?: AbortSignal): void
  (e: 'clear'): void
}>()

watch(model, (q) => {
  if (controller) {
    controller.abort()
    controller = null
  }
  window.clearTimeout(debounceTimer)
  if (!q) {
    emit('clear')
    loading.value = false
    return
  }
  loading.value = true
  debounceTimer = window.setTimeout(() => {
    controller = new AbortController()
    emit('search', q, controller.signal)
  }, 400)
})

function clear() {
  model.value = ''
  emit('clear')
}

onBeforeUnmount(() => {
  if (controller) controller.abort()
})
</script>

<template>
  <div class="relative">
    <Input v-model="model" placeholder="Search movies..." aria-label="Search movies" />
    <div class="absolute inset-y-0 right-3 flex items-center gap-2">
      <Spinner v-if="loading" />
      <button v-if="model" @click="clear" class="text-secondary hover:text-text focus-ring rounded px-1" aria-label="Clear search">
        ✕
      </button>
    </div>
  </div>
</template>
