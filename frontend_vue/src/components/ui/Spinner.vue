<script lang="ts">
export default {
  name: 'UiSpinner',
}
</script>
<template>
  <svg class="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" aria-hidden="true">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
  </svg>
</template>
