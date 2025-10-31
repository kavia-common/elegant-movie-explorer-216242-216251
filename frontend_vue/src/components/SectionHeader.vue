<template>
  <div class="mb-2 flex items-center justify-between">
    <h2 class="text-lg font-semibold text-text">
      <slot />
    </h2>
    <slot name="right" />
  </div>
</template>
