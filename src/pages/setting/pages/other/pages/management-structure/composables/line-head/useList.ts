import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionManagementStructureLineHeadPayload, IGetManagementStructureLineHeadList } from '@/models/request/management-structure-line-head/ManagementStructureLineHeadReq.model'
import type { IManagementStructureLineHeadList } from '@/models/response/management-structure-line-head/ManagementStructureLineHeadRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import ManagementStructureLineHeadProvider, { type IManagementStructureLineHeadProvider } from '@/resources/provider/management-structure-line-head/ManagementStructureLineHead.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/management-structure-zone-manager.schema'
import { useCreatePayload, useUpdatePayload } from './usePayload'

interface IUseList extends IUsePagination {
  items: Ref<IManagementStructureLineHeadList[]>
  form: Ref<IActionManagementStructureLineHeadPayload>
  useFetch: () => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
  reset: () => void
}

export default function useList (zoneManagerId: Ref<TBaseParamsId | null>): IUseList {
  const ManagementStructureLineHeadService: IManagementStructureLineHeadProvider = new ManagementStructureLineHeadProvider()

  const items = ref<IManagementStructureLineHeadList[]>([])
  const form = ref<IActionManagementStructureLineHeadPayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetManagementStructureLineHeadList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      zoneManagerId: typeof zoneManagerId.value === 'number' ? zoneManagerId.value : Number(zoneManagerId.value)
    }
  })

  async function useFetch (): Promise<void> {
    const response = await ManagementStructureLineHeadService.getManagementStructureLineHeadPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ zoneManagerId: zoneManagerId.value })
  }
  async function useCreate (): Promise<void> {
    normalizeForm()
    await ManagementStructureLineHeadService.createManagementStructureLineHead(useCreatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    normalizeForm()
    await ManagementStructureLineHeadService.updateManagementStructureLineHead(id, useUpdatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await ManagementStructureLineHeadService.deleteManagementStructureLineHead(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  function normalizeForm (): void {
    form.value.zoneManagerId = typeof zoneManagerId.value === 'number' ? zoneManagerId.value : Number(zoneManagerId.value)
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
    extractPagination,
    syncQuery,
    items,
    form,
    useFetch,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset,
    resetPagination
  }
}
