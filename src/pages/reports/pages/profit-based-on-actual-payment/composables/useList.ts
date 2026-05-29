import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IProfitBasedOnActualPaymentFilter } from '@/models/modules/report/profit-based-on-actual-payment/Filter.model'
import type { IGetProfitBasedOnActualPaymentList } from '@/models/request/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentReq.model'
import type {
  IProfitBasedOnActualPaymentList,
  IProfitBasedOnActualPaymentSummary
} from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import ProfitBasedOnActualPaymentProvider, { type IProfitBasedOnActualPaymentProvider } from '@/resources/provider/report/ProfitBasedOnActualPayment.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IProfitBasedOnActualPaymentFilter>
  items: Ref<IProfitBasedOnActualPaymentList[]>
  summary: Ref<IProfitBasedOnActualPaymentSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const ProfitBasedOnActualPaymentService: IProfitBasedOnActualPaymentProvider = new ProfitBasedOnActualPaymentProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IProfitBasedOnActualPaymentFilter>({})
  const items = ref<IProfitBasedOnActualPaymentList[]>([])
  const summary = ref<IProfitBasedOnActualPaymentSummary>({
    allPrincipal: 0,
    allInterest: 0,
    receiveInstallmentAmount: 0,
    principal: 0,
    interest: 0
  })

  const paginateQuery = computed((): IGetProfitBasedOnActualPaymentList => {
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
    const response = await ProfitBasedOnActualPaymentService.getProfitBasedOnActualPaymentPaginate(paginateQuery.value)
    items.value = response?.data || []
    summary.value = {
      allPrincipal: response?.summary?.allPrincipal || 0,
      allInterest: response?.summary?.allInterest || 0,
      receiveInstallmentAmount: response?.summary?.receiveInstallmentAmount || 0,
      principal: response?.summary?.principal || 0,
      interest: response?.summary?.interest || 0
    }
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IProfitBasedOnActualPaymentFilter): Partial<IProfitBasedOnActualPaymentFilter> {
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
