<template>
  <div
    id="app"
    class="flex h-screen overflow-hidden">
    <!-- ── Sidebar ─────────────────────────────────────────────── -->
    <AppDrawer class="shrink-0" />

    <!-- ── Backdrop (mobile only) ──────────────────────────────── -->
    <Transition name="drawer-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-black/40 md:hidden"
        @click="close()" />
    </Transition>

    <!-- ── Main content ────────────────────────────────────────── -->
    <div
      class="flex-1 flex flex-col overflow-hidden bg-[#F3F6F9]"
      data-app-scroll="true">
      <!-- Top bar -->
      <header class="flex justify-between items-center h-14 px-4 bg-white border-b border-[--p-gray-5] shrink-0">
        <div class="flex items-center gap-4">
          <button
            class="md:hidden flex items-center justify-center size-9 rounded hover:bg-surface-100 transition-colors"
            @click="toggle()">
            <Icon
              class="size-6 text-font-gray"
              icon="solar:hamburger-menu-linear" />
          </button>
          <!-- Desktop Top Left Content -->
          <div class="hidden md:block">
            <!-- Add breadcrumbs or other content here if needed -->
          </div>
        </div>

        <ProfileCard />
      </header>

      <div class="flex-1 overflow-y-auto py-4 px-5">
        <RouteTransition />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppDrawer from '@/components/app/AppDrawer.vue'
import ProfileCard from '@/components/nav/ProfileCard.vue'
import RouteTransition from '@/components/transition/RouteTransition.vue'
import { useAppDrawer } from '@/composables/useAppDrawer'
import { Icon } from '@iconify/vue'

const { isOpen, close, toggle } = useAppDrawer()
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}
</style>
