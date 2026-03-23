import { computed, type ComputedRef, ref, type Ref } from 'vue'
// import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetDocumentAssetsList } from '@/models/request/document-storage/DocumentStorageReq.model'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import DocumentStorageProvider, { type IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetDocumentAssetsList>
  items: Ref<IDocumentAssetList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (warehouseId: ComputedRef<number>): IUseList {
  const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetDocumentAssetsList>({})
  const items = ref<IDocumentAssetList[]>([])

  const paginateQuery = computed((): IGetDocumentAssetsList => {
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
    console.log(warehouseId.value)
    if (!warehouseId.value) return
    const response = await DocumentStorageService.getDocumentMovementAssetsPaginateByWarehouseId(warehouseId.value, paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: IGetDocumentAssetsList): Partial<IGetDocumentAssetsList> {
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

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
