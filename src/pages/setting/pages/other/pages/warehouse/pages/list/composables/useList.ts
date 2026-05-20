import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetWarehouseList } from '@/models/request/warehouse/WarehouseReq.model'
import type { IWarehouseList } from '@/models/response/warehouse/WarehouseRes.model'
import WarehouseProvider, { type IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetWarehouseList>
  items: Ref<IWarehouseList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const WarehouseService: IWarehouseProvider = new WarehouseProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IGetWarehouseList>({})
  const items = ref<IWarehouseList[]>([])

  const paginateQuery = computed((): IGetWarehouseList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await WarehouseService.getWarehousePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    await WarehouseService.deleteWarehouse(id)
    fetch()
    toast.success('ลบคลังสําเร็จ')
  }

  function normalizeFilters (value: IGetWarehouseList): Partial<IGetWarehouseList> {
    return {
      ...value,
      status: filters.value?.status
    }
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
  }

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    onDelete,
    extractPagination,
    syncQuery,
    reset
  }
}
