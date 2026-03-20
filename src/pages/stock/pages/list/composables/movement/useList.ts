import { computed, ref, type Ref } from 'vue'
// import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetDocumentMovementList } from '@/models/request/document-storage/DocumentStorageReq.model'
import type { IDocumentMovementList } from '@/models/response/document-storage/DocumentStorageRes.model'
import DocumentStorageProvider, { type IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetDocumentMovementList>
  items: Ref<IDocumentMovementList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetDocumentMovementList>({})
  const items = ref<IDocumentMovementList[]>([])

  const paginateQuery = computed((): IGetDocumentMovementList => {
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
    const response = await DocumentStorageService.getDocumentMovementPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: IGetDocumentMovementList): Partial<IGetDocumentMovementList> {
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
