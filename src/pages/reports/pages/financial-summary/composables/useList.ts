import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IFinancialSummaryReportFilter } from '@/models/modules/report/financial-summary/Filter.model'
import type { IGetFinancialSummaryReportList } from '@/models/request/report/financial-summary/FinancialSummaryReq.model'
import type { IFinancialSummaryReportList, IFinancialSummaryReportSummary } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import FinancialSummaryProvider, { type IFinancialSummaryProvider } from '@/resources/provider/report/FinancialSummary.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IFinancialSummaryReportFilter>
  items: Ref<IFinancialSummaryReportList[]>
  summary: Ref<IFinancialSummaryReportSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const FinancialSummaryService: IFinancialSummaryProvider = new FinancialSummaryProvider()

  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IFinancialSummaryReportFilter>({
    branchId: route?.query?.branchId ? String(route.query.branchId) : undefined
  })

  const items = ref<IFinancialSummaryReportList[]>([])

  const summary = ref<IFinancialSummaryReportSummary>({
    income: 0,
    principal: 0,
    expenses: 0
  })

  const paginateQuery = computed((): IGetFinancialSummaryReportList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinancialSummaryService.getFinancialSummaryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      income: response?.summary?.income || 0,
      principal: response?.summary?.principal || 0,
      expenses: response?.summary?.expenses || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IFinancialSummaryReportFilter): Partial<IFinancialSummaryReportFilter> {
    return { ...value }
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
    summary,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
