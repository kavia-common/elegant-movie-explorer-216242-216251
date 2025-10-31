<script lang="ts">
export default {
  name: 'UiInput',
}
</script>
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
defineProps<{ placeholder?: string; type?: string }>()
</script>

<template>
  <input
    v-model="model"
    :type="type || 'text'"
    :placeholder="placeholder"
    class="w-full rounded-lg border border-purple-200 bg-white px-4 py-2 focus-ring"
  />
</template>
