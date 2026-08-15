import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import NotificationProvider, { type INotificationProvider } from '@/resources/provider/notification/Notification.provider'
import { useAuthStore } from './Auth'

interface IUseNotification {
  isNewAnnouncement: Ref<boolean>
  isNewWork: Ref<boolean>
  readAnnouncement(): Promise<void>
  readWork(): Promise<void>
  initialize(): Promise<void>
  destroy(): void
}

export const useNotificationStore = defineStore(
  'Notification', (): IUseNotification => {
    const NotificationService: INotificationProvider = new NotificationProvider()

    const authStore = useAuthStore()

    const isNewAnnouncement = ref<boolean>(false)
    const isNewWork = ref<boolean>(false)

    async function readAnnouncement (): Promise<void> {
      const response = await NotificationService.checkNotification({ type: 'ANNOUNCEMENT' })
      isNewAnnouncement.value = response.hasUnread
    }

    async function readWork (): Promise<void> {
      const response = await NotificationService.checkNotification({ type: 'WORK' })
      isNewWork.value = response.hasUnread
    }

    async function initialize (): Promise<void> {
      if (!authStore.isAuthenticated) return
      await Promise.allSettled([readAnnouncement(), readWork()])
    }

    function destroy (): void {
      isNewAnnouncement.value = false
      isNewWork.value = false
    }

    return {
      isNewAnnouncement,
      isNewWork,
      readAnnouncement,
      readWork,
      initialize,
      destroy
    }
  }, { persist: false }
)
