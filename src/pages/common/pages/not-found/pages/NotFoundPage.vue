<template>
  <div class="flex h-screen flex-col items-center justify-center gap-3 text-center">
    <p class="text-6xl font-bold text-surface-400">
      404
    </p>
    <p class="text-lg font-medium text-surface-700">
      Page not found
    </p>
    <router-link
      :to="{ name: 'HomePage' }"
      class="mt-2 text-primary underline">
      Back to home
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
