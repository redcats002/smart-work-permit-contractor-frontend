import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailyLoanDisbursementFilter } from '@/models/modules/report/daily-loan-disbursement/Filter.model'
import type { IGetDailyLoanDisbursementList } from '@/models/request/report/daily-loan-disbursement/DailyLoanDisbursementReq.model'
import type { IDailyLoanDisbursementList, IDailyLoanDisbursementSummary } from '@/models/response/report/daily-loan-disbursement/DailyLoanDisbursementRes.model'
import DailyLoanDisbursementProvider, { type IDailyLoanDisbursementProvider } from '@/resources/provider/report/DailyLoanDisbursement.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IDailyLoanDisbursementFilter>
  items: Ref<IDailyLoanDisbursementList[]>
  summary: Ref<IDailyLoanDisbursementSummary>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const DailyLoanDisbursementService: IDailyLoanDisbursementProvider = new DailyLoanDisbursementProvider()

  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IDailyLoanDisbursementFilter>({
    categoryId: route?.query?.categoryId ? Number(route.query.categoryId) : undefined,
    paymentTypeId: route?.query?.paymentTypeId ? Number(route.query.paymentTypeId) : undefined
  })
  const items = ref<IDailyLoanDisbursementList[]>([])
  const summary = ref<IDailyLoanDisbursementSummary>({
    acknowledgement: 0,
    cutoff: 0,
    discount: 0,
    net: 0,
    numberOfCustomer: 0,
    payment: 0
  })
  // mock
  const mockResponse: IDailyLoanDisbursementList[] = []

  const paginateQuery = computed((): IGetDailyLoanDisbursementList => {
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
    if (mockResponse.length) {
      items.value = mockResponse
      return
    }
    const response = await DailyLoanDisbursementService.getDailyLoanDisbursementPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {}
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IDailyLoanDisbursementFilter): Partial<IDailyLoanDisbursementFilter> {
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
    summary,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
