import { ref, type Ref } from 'vue'
import type { IManagementPositionList } from '@/models/response/management-position/ManagementPositionRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { DataTableRowClickEvent } from 'primevue'
import useListZoneManager from './zone-manager/useList'
import useListLineHead from './line-head/useList'

interface IUseList {
  zoneManager: ReturnType<typeof useListZoneManager>
  lineHead: ReturnType<typeof useListLineHead>
  selectZoneManagerId: Ref<number | null>
  onDeleteZoneManager (id: TBaseParamsId): Promise<void>
  onSelectZoneManager: (event: DataTableRowClickEvent<IManagementPositionList>) => Promise<void>
}

export default function useList (): IUseList {
  const selectZoneManagerId = ref<number | null>(null)

  const zoneManager = useListZoneManager()
  const lineHead = useListLineHead(selectZoneManagerId)

  async function onDeleteZoneManager (id: TBaseParamsId): Promise<void> {
    await zoneManager.useDelete(id)
    lineHead.reset()
    selectZoneManagerId.value = null
    zoneManager.fetch()
  }
  async function onSelectZoneManager ({ data }: DataTableRowClickEvent<IManagementPositionList>): Promise<void> {
    selectZoneManagerId.value = typeof data?.id === 'number' ? data.id : null
    await lineHead.useFetch()
  }
  return { zoneManager, lineHead, selectZoneManagerId, onSelectZoneManager, onDeleteZoneManager }
}
