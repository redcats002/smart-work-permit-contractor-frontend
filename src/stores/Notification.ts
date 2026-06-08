import { computed, onBeforeUnmount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import useGateway, { type IGatewayResponse } from '@/resources/gateway/useGateway'
import NotificationProvider, { type INotificationProvider } from '@/resources/provider/notification/Notification.provider'
import { defineStore } from 'pinia'
import { useAuthStore } from './Auth'

export enum EWorkSocketEvent {
  'asset-appraisal:create' = 'asset-appraisal:create',
  'asset-appraisal:delete' = 'asset-appraisal:delete',
  'debt-collection:create' = 'debt-collection:create',
  'debt-collection:delete' = 'debt-collection:delete'
}
export enum EAnnouncementSocketEvent {
  'announcement:delete' = 'announcement:delete',
  'announcement:create' = 'announcement:create'
}

export type TWorkSocketEvent = keyof typeof EWorkSocketEvent
export type TAnnouncementSocketEvent = keyof typeof EAnnouncementSocketEvent
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

    const router = useRouter()
    const authStore = useAuthStore()

    const assetAppraisalCreate = useGateway(EWorkSocketEvent['asset-appraisal:create'], useFetch)
    const assetAppraisalDelete = useGateway(EWorkSocketEvent['asset-appraisal:delete'], useFetch)
    const debtCollectionCreateGateway = useGateway(EWorkSocketEvent['debt-collection:create'], useFetch)
    const debtCollectionDeleteGateway = useGateway(EWorkSocketEvent['debt-collection:delete'], useFetch)
    const announcementCreateGateway = useGateway(EAnnouncementSocketEvent['announcement:create'], useFetch)
    const announcementDeleteGateway = useGateway(EAnnouncementSocketEvent['announcement:delete'], useFetch)

    const isNewAnnouncement = ref<boolean>(false)
    const isNewWork = ref<boolean>(false)

    const isConnected = computed((): boolean => {
      return (
        assetAppraisalCreate.isConnected.value
        && assetAppraisalDelete.isConnected.value
        && debtCollectionCreateGateway.isConnected.value
        && debtCollectionDeleteGateway.isConnected.value
        && announcementCreateGateway.isConnected.value
        && announcementDeleteGateway.isConnected.value
      )
    })

    async function useFetch (e: IGatewayResponse): Promise<void> {
      const promises: Promise<void>[] = []

      if (e.type === 'announcement:create' || e.type === 'announcement:delete') await readAnnouncement()
      if (e.type === 'asset-appraisal:create' || e.type === 'asset-appraisal:delete') await readWork()
      if (e.type === 'debt-collection:create' || e.type === 'debt-collection:delete') await readWork()

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
      if (!isConnected.value || !authStore.isAuthenticated) return
      console.info('initial notification watcher')
      const promises: Promise<void>[] = [readAnnouncement(), readWork()]
      await Promise.allSettled(promises)
      initWatcher()
    }

    function initWatcher (): void {
      assetAppraisalCreate.initWatcher()
      assetAppraisalDelete.initWatcher()
      debtCollectionCreateGateway.initWatcher()
      debtCollectionDeleteGateway.initWatcher()
      announcementCreateGateway.initWatcher()
      announcementDeleteGateway.initWatcher()
    }

    function destroyWatcher (): void {
      assetAppraisalCreate.destroyWatcher()
      assetAppraisalDelete.destroyWatcher()
      debtCollectionCreateGateway.destroyWatcher()
      debtCollectionDeleteGateway.destroyWatcher()
      announcementCreateGateway.destroyWatcher()
      announcementDeleteGateway.destroyWatcher()
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
