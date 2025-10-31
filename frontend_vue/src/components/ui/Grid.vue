<script lang="ts">
export default {
  name: 'UiGrid',
}
</script>
<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    <slot />
  </div>
</template>
