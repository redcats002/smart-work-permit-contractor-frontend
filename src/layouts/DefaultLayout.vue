<template>
  <div
    id="app"
    class="flex h-screen flex-col overflow-hidden">
    <AppTopbar @toggle-menu="toggle()" />

    <div class="flex flex-1 overflow-hidden">
      <!-- ── Sidebar ─────────────────────────────────────────────── -->
      <AppDrawer />

      <!-- ── Backdrop (mobile only) ──────────────────────────────── -->
      <Transition name="drawer-backdrop">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-40 bg-black/40 min-[900px]:hidden"
          @click="close()" />
      </Transition>

      <!-- ── Main content ────────────────────────────────────────── -->
      <main
        class="flex-1 overflow-y-auto bg-(--color-surface-app) px-[30px] py-[26px]"
        data-app-scroll="true">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/Notification'
import AppDrawer from '@/components/app/AppDrawer.vue'
import AppTopbar from '@/components/app/AppTopbar.vue'
import { useAppDrawer } from '@/composables/useAppDrawer'

const notificationStore = useNotificationStore()
const { isOpen, close, toggle } = useAppDrawer()

onMounted(async (): Promise<void> => {
  await notificationStore.initialize()
})
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
