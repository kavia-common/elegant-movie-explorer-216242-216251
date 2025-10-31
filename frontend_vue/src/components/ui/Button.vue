<script lang="ts">
export default {
  name: 'UiButton',
}
</script>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  type: 'button'
})

const classes = computed(() => {
  const base = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium focus-ring transition'
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-purple-600 disabled:bg-primary/60 shadow-soft',
    secondary: 'bg-white text-text border border-purple-200 hover:bg-purple-50',
    ghost: 'bg-transparent text-primary hover:bg-purple-100',
  }
  return `${base} ${variants[props.variant]}`
})
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading" :aria-busy="loading">
    <slot />
  </button>
</template>
