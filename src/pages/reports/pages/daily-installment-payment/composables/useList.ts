import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDailyInstallmentPaymentFilter } from '@/models/modules/report/daily-installment-payment/Filter.model'
import type { IGetDailyInstallmentList } from '@/models/request/report/daliy-installment-payment/DailyInstallmentPayment.model'
import type { IDailyInstallmentPaymentList, IDailyInstallmentPaymentSummary } from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import DailyInstallmentPaymentProvider, { type IDailyInstallmentPaymentProvider } from '@/resources/provider/report/DailyInstallmentPayment.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IDailyInstallmentPaymentFilter>
  items: Ref<IDailyInstallmentPaymentList[]>
  summary: Ref<IDailyInstallmentPaymentSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const DailyInstallmentPaymentService: IDailyInstallmentPaymentProvider = new DailyInstallmentPaymentProvider()

  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyInstallmentPaymentFilter>({
    branchId: route?.query?.branchId ? String(route.query.branchId) : undefined,
    startDate: route?.query?.startDate ? String(route.query.startDate) : undefined,
    endDate: route?.query?.endDate ? String(route.query.endDate) : undefined
  })

  const items = ref<IDailyInstallmentPaymentList[]>([])

  const summary = ref<IDailyInstallmentPaymentSummary>({
    debtorCutAmount: 0,
    discountAmount: 0,
    netReceiveAmount: 0,
    allPrincipalAmount: 0,
    principalAmount: 0,
    interestAmount: 0
  })

  const paginateQuery = computed((): IGetDailyInstallmentList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      search: search.value || undefined,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await DailyInstallmentPaymentService.getDailyInstallmentPaymentPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      debtorCutAmount: response?.summary?.debtorCutAmount || 0,
      discountAmount: response?.summary?.discountAmount || 0,
      netReceiveAmount: response?.summary?.netReceiveAmount || 0,
      allPrincipalAmount: response?.summary?.allPrincipalAmount || 0,
      principalAmount: response?.summary?.principalAmount || 0,
      interestAmount: response?.summary?.interestAmount || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IDailyInstallmentPaymentFilter): Partial<IDailyInstallmentPaymentFilter> {
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
