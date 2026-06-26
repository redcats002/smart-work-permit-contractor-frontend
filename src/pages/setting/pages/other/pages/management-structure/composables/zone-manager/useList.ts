import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionManagementStructureLineHeadPayload, IGetManagementStructureLineHeadList } from '@/models/request/management-structure-line-head/ManagementStructureLineHeadReq.model'
import type { IManagementStructureZoneManagerList } from '@/models/response/management-structure-zone-manager/ManagementStructureZoneManagerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import ManagementStructureZoneManagerProvider, { type IManagementStructureZoneManagerProvider } from '@/resources/provider/management-structure-zone-manager/ManagementStructureZoneManager.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/management-structure-zone-manager.schema'

interface IUseList extends IUsePagination {
  items: Ref<IManagementStructureZoneManagerList[]>
  form: Ref<IActionManagementStructureLineHeadPayload>
  useDelete: (id: TBaseParamsId) => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
}

export default function useList (): IUseList {
  const ManagementStructureZoneManagerService: IManagementStructureZoneManagerProvider = new ManagementStructureZoneManagerProvider()

  const items = ref<IManagementStructureZoneManagerList[]>([])
  const form = ref<IActionManagementStructureLineHeadPayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetManagementStructureLineHeadList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value
    }
  })

  async function useFetch (): Promise<void> {
    const response = await ManagementStructureZoneManagerService.getManagementStructureZoneManagerPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery()
  }
  async function useCreate (): Promise<void> {
    await ManagementStructureZoneManagerService.createManagementStructureZoneManager(form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    await ManagementStructureZoneManagerService.updateManagementStructureZoneManager(id, form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await ManagementStructureZoneManagerService.deleteManagementStructureZoneManager(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }

  function onCreate (): void {
    handleLoading(useCreate)
  }
  function onUpdate (id: TBaseParamsId): void {
    handleLoading((): Promise<void> => useUpdate(id))
  }
  function onDelete (id: TBaseParamsId): void {
    handleLoading((): Promise<void> => useDelete(id))
  }
  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    pagination,
    search,
    sortBy,
    sortOrder,
    items,
    form,
    extractPagination,
    syncQuery,
    useDelete,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset,
    resetPagination
  }
}
