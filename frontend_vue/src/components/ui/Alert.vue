<script lang="ts">
export default {
  name: 'UiAlert',
}
</script>
<script setup lang="ts">
defineProps<{ type?: 'success' | 'error' | 'info'; message: string }>()
</script>

<template>
  <div
    role="status"
    :class="[
      'rounded-lg px-4 py-3 border',
      type === 'success' && 'bg-emerald-50 text-emerald-800 border-emerald-200',
      type === 'error' && 'bg-red-50 text-red-800 border-red-200',
      (!type || type === 'info') && 'bg-purple-50 text-purple-900 border-purple-200',
    ]"
  >
    <p class="text-sm">{{ message }}</p>
  </div>
</template>
