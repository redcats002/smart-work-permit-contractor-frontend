import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICreateManagementPositionPayload, IGetManagementPositionList } from '@/models/request/management-position/ManagementPositionReq.model'
import type { IManagementPositionList } from '@/models/response/management-position/ManagementPositionRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { EManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import ManagementPositionProvider, { type IManagementPositionProvider } from '@/resources/provider/management-position/ManagementPosition.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/management-structure-zone-manager.schema'

interface IUseList extends IUsePagination {
  items: Ref<IManagementPositionList[]>
  form: Ref<ICreateManagementPositionPayload>
  useDelete: (id: TBaseParamsId) => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
}

export default function useList (): IUseList {
  const ManagementPositionService: IManagementPositionProvider = new ManagementPositionProvider()

  const items = ref<IManagementPositionList[]>([])
  const form = ref<ICreateManagementPositionPayload>({
    managementPosition: EManagementPosition.DISTRICT_MANAGER,
    ...useFormInitialValues()
  })
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetManagementPositionList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      managementPosition: EManagementPosition.DISTRICT_MANAGER
    }
  })

  async function useFetch (): Promise<void> {
    const response = await ManagementPositionService.getManagementPositionPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery()
  }
  async function useCreate (): Promise<void> {
    await ManagementPositionService.createManagementPosition({
      name: form.value.name,
      managementPosition: EManagementPosition.DISTRICT_MANAGER
    })
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    await ManagementPositionService.updateManagementPosition(id, {
      name: form.value.name,
      managementPosition: EManagementPosition.DISTRICT_MANAGER,
      parentId: null
    })
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    handleLoading(async (): Promise<void> => {
      await ManagementPositionService.deleteManagementPosition(id)
      toast.success('ดำเนินการสำเร็จ')
      await useFetch()
    })
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
