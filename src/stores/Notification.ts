import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { IPublicGatewayResponse } from '@/models/response/public/ResponsePublic.model'
import usePublicGateway from '@/resources/gateway/usePublic.gateway'
import NotificationProvider, { type INotificationProvider } from '@/resources/provider/notification/Notification.provider'
import { defineStore } from 'pinia'
import { useAuthStore } from './Auth'

interface IUseNotification {
  isNewAnnouncement: Ref<boolean>
  isNewWork: Ref<boolean>
  readAnnouncement(): Promise<void>
  readWork(): Promise<void>
  initialize (): Promise<void>
  destroy (): void
}

export const useNotificationStore = defineStore(
  'Notification', (): IUseNotification => {
    const NotificationService: INotificationProvider = new NotificationProvider()

    const router = useRouter()
    const authStore = useAuthStore()

    const { isConnected, destroyWatcher, initWatcher } = usePublicGateway(useFetch)

    const isNewAnnouncement = ref<boolean>(false)
    const isNewWork = ref<boolean>(false)

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

    async function initialize (): Promise<void> {
      await router.isReady()
      if ((isConnected.value || !authStore.isAuthenticated)) return
      console.info('initial notification watcher')
      const promises: Promise<void>[] = [
        readAnnouncement(),
        readWork()
      ]
      await Promise.allSettled(promises)
      initWatcher()
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
