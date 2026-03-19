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
          Not Available
        </p>
        <h1 class="text-2xl font-bold">
          This Page Not Available Temporarily
        </h1>
        <p class="text-surface-500 text-sm">
          Please contact the administrator for more information
        </p>
      </div>
      <Button
        label="Back to Login"
        @click="back()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function back (): void {
  router.push({ name: 'HomePage' })
}
</script>
