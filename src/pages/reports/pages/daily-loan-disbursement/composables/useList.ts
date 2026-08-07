import { computed, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
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
  onSearch(): void
  onClearFilters(): void
  onPrint(): void
}

export default function useList (): IUseList {
  const DailyLoanDisbursementService: IDailyLoanDisbursementProvider = new DailyLoanDisbursementProvider()

  const route = useRoute()
  const router = useRouter()
  const dayjs = useDayjs()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyLoanDisbursementFilter>({
    branchId: route?.query?.branchId ? String(route.query.branchId) : undefined,
    startDate: route?.query?.startDate ? String(route.query.startDate) : undefined,
    endDate: route?.query?.endDate ? String(route.query.endDate) : undefined
  })

  const items = ref<IDailyLoanDisbursementList[]>([])

  const summary = ref<IDailyLoanDisbursementSummary>({
    principalAndInterest: 0,
    principal: 0,
    administrativeCost: 0,
    interest: 0,
    monthlyInstallment: 0,
    installmentCount: 0
  })

  const paginateQuery = computed((): IGetDailyLoanDisbursementList => {
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
    const response = await DailyLoanDisbursementService.getDailyLoanDisbursementPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      principalAndInterest: response?.summary?.principalAndInterest || 0,
      principal: response?.summary?.principal || 0,
      administrativeCost: response?.summary?.administrativeCost || 0,
      interest: response?.summary?.interest || 0,
      monthlyInstallment: response?.summary?.monthlyInstallment || 0,
      installmentCount: response?.summary?.installmentCount || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IDailyLoanDisbursementFilter): Partial<IDailyLoanDisbursementFilter> {
    return {
      ...value,
      startDate: dayjs.formatDateRequest(value?.startDate),
      endDate: dayjs.formatDateRequest(value?.endDate)
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
      name: 'DailyLoanDisbursementPrintPage',
      query: {
        search: search.value || undefined,
        ...normalizeFilters(filters.value)
      }
    })
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
    reset,
    onPrint
  }
}
