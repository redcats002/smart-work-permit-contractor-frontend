<template>
  <div
    id="app"
    class="flex h-screen overflow-hidden">
    <AppDrawer
      class="shrink-0" />
    <div
      class="flex-1 overflow-y-auto py-4 px-5 bg-[#F3F6F9]"
      data-app-scroll="true">
      <RouteTransition />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppDrawer from '@/components/app/AppDrawer.vue'
import RouteTransition from '@/components/transition/RouteTransition.vue'
</script>
