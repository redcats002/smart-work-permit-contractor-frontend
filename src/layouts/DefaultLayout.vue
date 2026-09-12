<template>
  <div
    id="app"
    class="flex h-screen flex-col overflow-hidden">
    <!--
      wayfinder 112 — the permit report's print stylesheet hides app chrome so a printed/saved-as-PDF
      report shows only the active report content. `print:hidden` is scoped to the chrome elements
      themselves rather than a page-specific override, so every page prints clean, not only the report.
    -->
    <AppTopbar
      class="print:hidden"
      @toggle-menu="toggle()" />

    <div class="flex flex-1 overflow-hidden">
      <!-- ── Sidebar ─────────────────────────────────────────────── -->
      <AppDrawer class="print:hidden" />

      <!-- ── Backdrop (mobile only) ──────────────────────────────── -->
      <Transition name="drawer-backdrop">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-40 bg-black/40 min-[900px]:hidden print:hidden"
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
import { useNotificationPolling } from '@/composables/useNotificationPolling'
import { useRealtimeSocket } from '@/composables/useRealtimeSocket'

const notificationStore = useNotificationStore()
const { isOpen, close, toggle } = useAppDrawer()

// PLT-007: the initial fetch below primes the notification list immediately on mount;
// useNotificationPolling owns the recurring list refresh and stops it the moment the contractor
// is unauthenticated. wayfinder 109: useRealtimeSocket owns the badge count instead — live over
// the socket while connected, `GET /v1/badges` on an interval as the fallback while it is not.
useNotificationPolling()
useRealtimeSocket()

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
