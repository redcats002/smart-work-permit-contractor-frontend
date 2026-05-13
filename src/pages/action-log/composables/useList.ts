import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionLogFilter } from '@/models/modules/action-log/Filter.model'
import type { IGetActionLogList } from '@/models/request/action-log/ActionLogReq.model'
import type { IActionLogList } from '@/models/response/action-log/ActionLogRes.model'
import ActionLogProvider, { type IActionLogProvider } from '@/resources/provider/action-log/ActionLog.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IActionLogFilter>
  items: Ref<IActionLogList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const ActionLogService: IActionLogProvider = new ActionLogProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IActionLogFilter>({})
  const items = ref<IActionLogList[]>([])

  const paginateQuery = computed((): IGetActionLogList => {
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
    const response = await ActionLogService.getActionLogPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IGetActionLogList): Partial<IGetActionLogList> {
    return {
      ...value
    }
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
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
