<template>
  <div class="grid place-content-center h-full min-h-svh p-6">
    <div class="flex flex-col items-center gap-4 text-center max-w-sm">
      <img
        alt="Logo"
        class="size-16 opacity-60"
        loading="lazy"
        src="/assets/images/empty-state.png">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-surface-500">
          Page not found
        </p>
        <h1 class="text-2xl font-bold">
          Whoops, 404
        </h1>
        <p class="text-surface-500 text-sm">
          The page you were looking for does not exist
        </p>
      </div>
      <Button
        label="Back to Home"
        @click="back()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function back (): void {
  router.back()
}
</script>
