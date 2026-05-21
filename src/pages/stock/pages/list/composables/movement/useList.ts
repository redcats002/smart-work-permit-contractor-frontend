import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
// import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDocumentMovementFilter } from '@/models/modules/document-storage/Filter'
import type { IGetDocumentMovementList } from '@/models/request/document-storage/DocumentStorageReq.model'
import type { IDocumentMovementList } from '@/models/response/document-storage/DocumentStorageRes.model'
import DocumentStorageProvider, { type IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IDocumentMovementFilter>
  items: Ref<IDocumentMovementList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()
  const route = useRoute()
  const dayjs = useDayjs()
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDocumentMovementFilter>({
    destinationWarehouseId: route?.query?.destinationWarehouseId ? Number(route.query.destinationWarehouseId) : undefined,
    originalWarehouseId: route?.query?.originalWarehouseId ? Number(route.query.originalWarehouseId) : undefined,
    startDate: route?.query?.startDate ? String(route.query.startDate) : undefined,
    endDate: route?.query?.endDate ? String(route.query.endDate) : undefined,
    status: route?.query?.status ? String(route.query.status) as IGetDocumentMovementList['status'] : undefined
  })
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
      ...value,
      status: value?.status || undefined,
      startDate: value?.startDate ? dayjs.formatDateRequest(value.startDate) || '' : undefined,
      endDate: value?.endDate ? dayjs.formatDateRequest(value.endDate) || '' : undefined
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
    reset()
    filters.value = {}
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
    extractPagination,
    syncQuery,
    reset
  }
}
