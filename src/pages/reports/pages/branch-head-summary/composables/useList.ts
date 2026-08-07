import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBranchHeadSummaryFilter } from '@/models/modules/report/branch-head-summary/Filter.model'
import type { IGetBranchHeadSummaryList } from '@/models/request/report/branch-head-summary/BranchHeadSummaryReq.model'
import type { IBranchHeadSummaryList } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'
import LeaderBranchReportProvider, { type ILeaderBranchReportProvider } from '@/resources/provider/report/LeaderBranchReport.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchHeadSummaryFilter>
  items: Ref<IBranchHeadSummaryList[]>
  summary: Ref<IBranchHeadSummaryList | null>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}

export default function useList (): IUseList {
  const router = useRouter()
  const dayjs = useDayjs()

  const LeaderBranchReportService: ILeaderBranchReportProvider = new LeaderBranchReportProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IBranchHeadSummaryFilter>({})
  const items = ref<IBranchHeadSummaryList[]>([])
  const summary = ref<IBranchHeadSummaryList | null>(null)

  const paginateQuery = computed((): IGetBranchHeadSummaryList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizeFilters(filters.value)
    }
  })

  async function useFetch (): Promise<void> {
    const response = await LeaderBranchReportService.getLeaderBranchReportPaginate(paginateQuery.value)
    items.value = response?.data || []
    summary.value = response?.summary || null
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IBranchHeadSummaryFilter): Partial<IBranchHeadSummaryFilter> {
    return {
      ...value,
      date: dayjs.formatDateRequest(value?.date)
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

  function onPrint (): void {
    router.push({
      name: 'BranchHeadSummaryPrintPage',
      query: {
        search: search.value || undefined,
        period: filters.value.period || undefined,
        ...normalizeFilters(filters.value)
      }
    })
  }

  return {
    filters,
    items,
    summary,
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
    reset,
    onPrint
  }
}
