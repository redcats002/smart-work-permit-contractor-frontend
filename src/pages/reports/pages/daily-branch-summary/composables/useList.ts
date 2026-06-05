import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IDailyBranchSummaryFilter } from '@/models/modules/report/daily-branch-summary/Filter.model'
import type { IGetDailyBranchSummaryList } from '@/models/request/report/daily-branch-summary/DailyBranchSummaryReq.model'
import type { IDailyBranchSummaryList } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import DailyBranchSummaryProvider, { type IDailyBranchSummaryProvider } from '@/resources/provider/report/DailyBranchSummary.provider'

const DailyBranchSummaryService: IDailyBranchSummaryProvider = new DailyBranchSummaryProvider()

interface IUseList extends IUsePagination {
  filters: Ref<IDailyBranchSummaryFilter>
  items: Ref<IDailyBranchSummaryList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyBranchSummaryFilter>({})
  const items = ref<IDailyBranchSummaryList[]>([])

  const paginateQuery = computed((): IGetDailyBranchSummaryList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    branchId: filters.value.branchId,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }))

  async function useFetch (): Promise<void> {
    const response = await DailyBranchSummaryService.getDailyBranchSummaryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...paginateQuery.value })
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
