import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBranchSummaryReportFilter } from '@/models/modules/report/branch-summary/Filter.model'
import type { IGetBranchSummaryReportList } from '@/models/request/report/branch-summary/BranchSummaryReq.model'
import type { IBranchSummaryReportList } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import ReportBranchesProvider, { type IReportBranchesProvider } from '@/resources/provider/report/Branches.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchSummaryReportFilter>
  items: Ref<IBranchSummaryReportList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const ReportBranchesService: IReportBranchesProvider = new ReportBranchesProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IBranchSummaryReportFilter>({})
  const items = ref<IBranchSummaryReportList[]>([])

  const resolvedSortBy = computed((): string | undefined => {
    if (!sortBy.value) return undefined
    return sortBy.value === 'duration' ? 'openAt' : sortBy.value
  })

  const resolvedSortOrder = computed((): 'asc' | 'desc' => {
    if (sortBy.value === 'duration') {
      return sortOrder.value === 'asc' ? 'desc' : 'asc'
    }
    return sortOrder.value
  })

  const paginateQuery = computed((): IGetBranchSummaryReportList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value || undefined,
      sortBy: resolvedSortBy.value,
      sortOrder: resolvedSortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await ReportBranchesService.getReportBranchesPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ search: search.value, ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: IBranchSummaryReportFilter): Partial<IBranchSummaryReportFilter> {
    return {
      ...value
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
