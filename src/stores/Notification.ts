import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { IPublicGatewayResponse } from '@/models/response/public/ResponsePublic.model'
import usePublicGateway from '@/resources/gateway/usePublic.gateway'
import NotificationProvider, { type INotificationProvider } from '@/resources/provider/notification/Notification.provider'
import { defineStore } from 'pinia'
import { useAuthStore } from './Auth'

interface IUseNotification {
  isNewAnnouncement: Ref<boolean>
  isNewWork: Ref<boolean>
  readAnnouncement(): void
  readWork(): void
  initialize (): void
  destroy (): void
}

export const useNotificationStore = defineStore(
  'Notification', (): IUseNotification => {
    const NotificationService: INotificationProvider = new NotificationProvider()

    const router = useRouter()
    const authStore = useAuthStore()

    const { isConnected, destroyWatcher, initWatcher } = usePublicGateway(useFetch)

    const isNewAnnouncement = ref<boolean>(true)
    const isNewWork = ref<boolean>(true)

    async function useFetch (e: IPublicGatewayResponse): Promise<void> {
      const promises: Promise<void>[] = []

      if (e.type === 'ANNOUNCEMENT') await readAnnouncement()
      if (e.type === 'WORK') await readWork()

      await Promise.allSettled(promises)
    }

    async function readAnnouncement (): Promise<void> {
      const response = await NotificationService.checkNotification({ type: 'ANNOUNCEMENT' })
      isNewAnnouncement.value = response.hasUnread
    }

    async function readWork (): Promise<void> {
      const response = await NotificationService.checkNotification({ type: 'WORK' })
      isNewWork.value = response.hasUnread
    }

    function initialize (): void {
      onMounted(async (): Promise<void> => {
        await router.isReady()
        if (isConnected.value || !authStore.isAuthenticated) return
        console.log('initial notification watcher')
        initWatcher()
      })
    }

    function destroy (): void {
      onBeforeUnmount((): void => {
        destroyWatcher()
      })
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
