import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IDailyBranchSummaryFilter } from '@/models/modules/report/daily-branch-summary/Filter.model'
import type { IGetDailyBranchSummaryList } from '@/models/request/report/daily-branch-summary/DailyBranchSummaryReq.model'
import type { IDailyBranchSummaryList, TGetDailyBranchSummaryListResponse } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import DailyBranchSummaryProvider, { type IDailyBranchSummaryProvider } from '@/resources/provider/report/DailyBranchSummary.provider'

const DailyBranchSummaryService: IDailyBranchSummaryProvider = new DailyBranchSummaryProvider()

type TSummary = TGetDailyBranchSummaryListResponse['summary']

interface IUseList extends IUsePagination {
  filters: Ref<IDailyBranchSummaryFilter>
  items: Ref<IDailyBranchSummaryList[]>
  summary: Ref<TSummary | undefined>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}

export default function useList (): IUseList {
  const router = useRouter()
  const dayjs = useDayjs()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyBranchSummaryFilter>({})
  const items = ref<IDailyBranchSummaryList[]>([])
  const summary = ref<TSummary | undefined>(undefined)

  const paginateQuery = computed((): IGetDailyBranchSummaryList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    branchId: filters.value.branchId,
    startDate: dayjs.formatDateRequest(filters.value.startDate),
    endDate: dayjs.formatDateRequest(filters.value.endDate)
  }))

  async function useFetch (): Promise<void> {
    const response = await DailyBranchSummaryService.getDailyBranchSummaryPaginate(paginateQuery.value)
    items.value = response?.data || []
    summary.value = response?.summary
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

  function onPrint (): void {
    router.push({
      name: 'DailyBranchSummaryPrintPage',
      query: {
        search: search.value || undefined,
        branchId: filters.value.branchId || undefined,
        startDate: dayjs.formatDateRequest(filters.value.startDate),
        endDate: dayjs.formatDateRequest(filters.value.endDate)
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
