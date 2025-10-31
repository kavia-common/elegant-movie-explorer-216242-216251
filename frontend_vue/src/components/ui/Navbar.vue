<script lang="ts">
export default {
  name: 'UiNavbar',
}
</script>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from './Button.vue'
import { useAuthStore } from '@/stores/auth'
import Alert from './Alert.vue'
const auth = useAuthStore()
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <div class="mx-auto max-w-7xl px-4">
      <div class="mt-4 rounded-2xl border border-white/40 bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/40 shadow-soft">
        <nav class="flex items-center justify-between px-4 py-3">
          <RouterLink to="/" class="flex items-center gap-2 focus-ring">
            <span class="inline-block h-3 w-3 rounded-full bg-primary"></span>
            <span class="text-sm font-semibold text-text">Elegant Movie Explorer</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <RouterLink to="/app" class="hidden sm:block text-sm text-secondary hover:text-text focus-ring px-2 py-1 rounded-lg">App</RouterLink>
            <template v-if="auth.isAuthenticated">
              <span class="hidden sm:inline text-sm text-secondary">Hi, {{ auth.user?.user_metadata?.name || 'User' }}</span>
              <Button variant="secondary" @click="auth.signOut()">Sign out</Button>
            </template>
            <template v-else>
              <Button @click="auth.signInWithGoogle()">Sign in with Google</Button>
            </template>
          </div>
        </nav>
        <div v-if="auth.alert" class="px-4 pb-4">
          <Alert :type="auth.alert.type" :message="auth.alert.message" />
        </div>
      </div>
    </div>
  </header>
</template>
