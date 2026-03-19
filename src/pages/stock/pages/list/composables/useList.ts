import { computed, ref, type Ref } from 'vue'
// import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetStockList } from '@/models/request/stock/StockReq.model'
import type { IStockList } from '@/models/response/stock/StockRes.model'
import DocumentStorageProvider, { type IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetStockList>
  items: Ref<IStockList[]>
  fetch(): void
  onClearFilters(): void
  // onDelete(id: number): void
}
export default function useList (): IUseList {
  const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetStockList>({})
  const items = ref<IStockList[]>([])

  const paginateQuery = computed((): IGetStockList => {
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
    const response = await DocumentStorageService.getDocumentStorageAssetsPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  // async function useDelete (id: number): Promise<void> {
  //   await StockService.deleteStock(id)
  //   fetch()
  //   toast.success('ลบลูกค้าสําเร็จ')
  // }

  function normalizeFilters (value: IGetStockList): Partial<IGetStockList> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
  }

  // function onDelete (id: number): void {
  //   handleLoading((): Promise<void> => useDelete(id))
  // }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    // onDelete,
    extractPagination,
    syncQuery,
    reset
  }
}
