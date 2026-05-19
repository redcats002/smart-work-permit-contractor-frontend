import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { ILoanDisbursementSummaryFilter } from '@/models/modules/report/loan-disbursement-summary/Filter.model'
import type { IGetLoanDisbursementSummaryList } from '@/models/request/report/loan-disbursement-summary/LoanDisbursementSummaryReq.model'
import type {
  ILoanDisbursementSummaryList,
  ILoanDisbursementSummarySummary
} from '@/models/response/report/loan-disbursement-summary/LoanDisbursementSummaryRes.model'
import LoanDisbursementSummaryProvider, { type ILoanDisbursementSummaryProvider } from '@/resources/provider/report/LoanDisbursementSummary.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<ILoanDisbursementSummaryFilter>
  items: Ref<ILoanDisbursementSummaryList[]>
  summary: Ref<ILoanDisbursementSummarySummary>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const LoanDisbursementSummaryService: ILoanDisbursementSummaryProvider = new LoanDisbursementSummaryProvider()

  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<ILoanDisbursementSummaryFilter>({
    branchId: route?.query?.branchId ? Number(route.query.branchId) : undefined,
    startDate: route?.query?.startDate ? String(route.query.startDate) : undefined,
    endDate: route?.query?.endDate ? String(route.query.endDate) : undefined
  })
  const items = ref<ILoanDisbursementSummaryList[]>([])
  const summary = ref<ILoanDisbursementSummarySummary>({
    numberOfBranches: 0,
    contractAmount: 0,
    principal: 0,
    interest: 0,
    principalAndInterest: 0,
    monthlyInstallment: 0
  })
  const paginateQuery = computed((): IGetLoanDisbursementSummaryList => {
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
    const response = await LoanDisbursementSummaryService.getLoanDisbursementSummaryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      numberOfBranches: response?.count || 0,
      contractAmount: response?.summary?.contractAmount || 0,
      principal: response?.summary?.principal || 0,
      interest: response?.summary?.interest || 0,
      principalAndInterest: response?.summary?.principalAndInterest || 0,
      monthlyInstallment: response?.summary?.monthlyInstallment || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: ILoanDisbursementSummaryFilter): Partial<ILoanDisbursementSummaryFilter> {
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
