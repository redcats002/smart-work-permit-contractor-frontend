import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAccessLogFilter } from '@/models/modules/access-log/Filter.model'
import type { IGetAccessLogList } from '@/models/request/access-log/AccessLogReq.model'
import type { IAccessLogList } from '@/models/response/access-log/AccessLogRes.model'
import AccessLogProvider, { type IAccessLogProvider } from '@/resources/provider/access-log/AccessLog.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IAccessLogFilter>
  items: Ref<IAccessLogList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const AccessLogService: IAccessLogProvider = new AccessLogProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IAccessLogFilter>({})
  const items = ref<IAccessLogList[]>([])

  const paginateQuery = computed((): IGetAccessLogList => {
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
    const response = await AccessLogService.getAccessLogPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IGetAccessLogList): Partial<IGetAccessLogList> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
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
    onClearFilters,
    extractPagination,
    syncQuery
  }
}
