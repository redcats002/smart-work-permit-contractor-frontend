import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetDailySummaryList } from '@/models/request/report/daily-summary/DailySummary.model'
import type { IDailySummaryListItem } from '@/models/response/report/daily-summary/DailySummaryRes'
import DailySummaryProvider from '@/resources/provider/report/DailySummary.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetDailySummaryList>
  items: Ref<IDailySummaryListItem[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const DailySummaryService = new DailySummaryProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IGetDailySummaryList>({})
  const items = ref<IDailySummaryListItem[]>([])

  const paginateQuery = computed((): IGetDailySummaryList => ({
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    ...filters.value
  }))

  async function useFetch (): Promise<void> {
    const response = await DailySummaryService.getDailySummaryList(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...filters.value })
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
