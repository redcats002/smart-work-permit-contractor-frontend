import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { INotification } from '@/models/response/notification/NotificationRes.model'
import NotificationProvider, { type INotificationProvider } from '@/resources/provider/notification/Notification.provider'
import { useAuthStore } from './Auth'

interface IUseNotification {
  notifications: Ref<INotification[]>
  unreadCount: ComputedRef<number>
  fetch(): Promise<void>
  dismiss(id: number): Promise<void>
  initialize(): Promise<void>
  destroy(): void
}

/**
 * Notification state (API-008). The previous shape — `isNewAnnouncement` / `isNewWork`, fed by a
 * `/notifications/check` endpoint that does not exist — was lending-era: this product has one
 * notification feed, scoped server-side to the signed-in account's role.
 *
 * Polling is deliberately NOT here: `PLT-007` owns the interval and its lifecycle.
 */
export const useNotificationStore = defineStore(
  'Notification', (): IUseNotification => {
    const NotificationService: INotificationProvider = new NotificationProvider()

    const notifications = ref<INotification[]>([])

    const unreadCount: ComputedRef<number> = computed(
      (): number => notifications.value.filter((notification: INotification): boolean => !notification.read).length
    )

    // (feat-011c) GET /notifications is now really paginated (page/limit, same envelope shape as
    // certificates) — `response.data` is still the row array, so this store's own shape is
    // unaffected. Page 1 at a generous limit keeps today's "one feed, no client paging UI" behavior;
    // building an actual paged notification list is a separate, not-yet-scheduled item.
    async function fetch (): Promise<void> {
      const response = await NotificationService.list({ page: 1, limit: 50 })
      notifications.value = response.data ?? []
    }

    // The endpoint answers { message: 'success' } with no body, so the local copy is marked read
    // here rather than replaced with a server row.
    async function dismiss (id: number): Promise<void> {
      await NotificationService.dismiss(id)
      const index = notifications.value.findIndex((notification: INotification): boolean => notification.id === id)
      if (index === -1) return
      notifications.value.splice(index, 1, { ...notifications.value[index], read: true })
    }

    // Swallows its own failure on purpose: DefaultLayout awaits this on mount, and a 401 or a
    // down API must not take the whole layout with it. A caller that needs the error calls fetch().
    async function initialize (): Promise<void> {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return
      try {
        await fetch()
      } catch (error) {
        console.error('[Notification] initial fetch failed', error)
      }
    }

    function destroy (): void {
      notifications.value = []
    }

    return { notifications, unreadCount, fetch, dismiss, initialize, destroy }
  }, { persist: false }
)
