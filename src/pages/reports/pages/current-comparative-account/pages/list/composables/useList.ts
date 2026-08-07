import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCurrentComparativeList } from '@/models/request/report/current-comparative-account/CurrentComparativeReq.model'
import type {
  ICurrentComparativeAccountList,
  ICurrentComparativeAccountSummary
} from '@/models/response/report/current-comparative-account/CurrentComparativeAccountRes.model'
import type { ICurrentComparativeAccountFilter } from '@/models/modules/report/current-comparative-account/Filter.model'
import CurrentComparativeAccountProvider, {
  type ICurrentComparativeAccountProvider
} from '@/resources/provider/report/CurrentComparativeAccount.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<ICurrentComparativeAccountFilter>
  items: Ref<ICurrentComparativeAccountList[]>
  summary: Ref<ICurrentComparativeAccountSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}
export default function useList (): IUseList {
  const router = useRouter()
  const dayjs = useDayjs()

  const CurrentComparativeAccountService: ICurrentComparativeAccountProvider = new CurrentComparativeAccountProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<ICurrentComparativeAccountFilter>({})
  const items = ref<ICurrentComparativeAccountList[]>([])
  const summary = ref<ICurrentComparativeAccountSummary>({
    numberOfBranches: 0,
    contractAmount: 0,
    principal: 0,
    principalAndInterest: 0,
    amountPaid: 0,
    settlementDiscount: 0,
    remainingAmount: 0
  })

  const paginateQuery = computed((): IGetCurrentComparativeList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value || undefined,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await CurrentComparativeAccountService.getCurrentComparativeAccountPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      numberOfBranches: response?.count || 0,
      contractAmount: response?.summary?.contractAmount || 0,
      principal: response?.summary?.principal || 0,
      principalAndInterest: response?.summary?.principalAndInterest || 0,
      amountPaid: response?.summary?.amountPaid || 0,
      settlementDiscount: response?.summary?.settlementDiscount || 0,
      remainingAmount: response?.summary?.remainingAmount || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (
    value: ICurrentComparativeAccountFilter
  ): Partial<ICurrentComparativeAccountFilter> {
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
    filters.value = {}
  }

  function onPrint (): void {
    router.push({
      name: 'ComparativePrintPage',
      query: {
        search: search.value || undefined,
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
