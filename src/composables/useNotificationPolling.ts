import { onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

/**
 * PLT-007. Push is explicitly out of scope (02-contractor-web-vue-tasks.md) — this is the only
 * mechanism that refreshes the notification feed. A named constant rather than a magic number so
 * the interval can only drift in one place.
 */
export const NOTIFICATION_POLL_INTERVAL_MS = 30000

export interface IUseNotificationPolling {
  start (): void
  stop (): void
}

/**
 * Starts a `setInterval` poll of the notification feed while the contractor is signed in, and
 * tears it down the moment they are not — a poll loop that keeps firing after logout produces an
 * endless 401 stream against `GET /notifications`.
 *
 * `notificationStore.initialize()` (not `fetch()`) is called on every tick: it already re-checks
 * `isAuthenticated` and swallows its own failure, so a flaky poll never surfaces a toast storm.
 *
 * The `watch(..., { immediate: true })` below is what actually stops polling on logout — the
 * interval itself only ever calls `initialize()`, which is a no-op once signed out, but leaving
 * it running would still fire a request every tick. Call `stop()` is also wired to `onUnmounted`,
 * so mounting this inside `DefaultLayout` (which unmounts when `route.meta.layout` switches to
 * `'blank'` for `/auth/*`) is enough on its own; the auth watch handles the SPA logout case, where
 * `DefaultLayout` stays mounted while `useLogout` navigates away.
 */
export function useNotificationPolling (): IUseNotificationPolling {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  let timer: ReturnType<typeof setInterval> | null = null

  function stop (): void {
    if (timer === null) return
    clearInterval(timer)
    timer = null
  }

  function start (): void {
    if (timer !== null) return
    timer = setInterval((): void => {
      void notificationStore.initialize()
    }, NOTIFICATION_POLL_INTERVAL_MS)
  }

  watch(
    (): boolean => authStore.isAuthenticated, (isAuthenticated: boolean): void => {
      if (isAuthenticated) {
        start()
        return
      }
      stop()
      notificationStore.destroy()
    }, { immediate: true }
  )

  onUnmounted((): void => {
    stop()
  })

  return { start, stop }
}

export default useNotificationPolling
