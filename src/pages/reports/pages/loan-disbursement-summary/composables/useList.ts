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
  type TSummaryItem = ILoanDisbursementSummaryList

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
    amount: 0,
    principal: 0,
    interest: 0,
    principalWithInterest: 0,
    installment: 0
  })
  // mock
  const mockResponse: ILoanDisbursementSummaryList[] = [
    {
      id: 1,
      idNo: 'LDS-000001',
      branch: {
        id: 101,
        idNo: 'BR-001',
        name: 'สาขาเมืองขอนแก่น',
        status: 'ACTIVE'
      },
      amount: 24,
      principal: 1380000,
      interest: 124200,
      principalWithInterest: 1504200,
      installment: 62675
    },
    {
      id: 2,
      idNo: 'LDS-000002',
      branch: {
        id: 102,
        idNo: 'BR-002',
        name: 'สาขามหาสารคาม',
        status: 'ACTIVE'
      },
      amount: 18,
      principal: 960000,
      interest: 86400,
      principalWithInterest: 1046400,
      installment: 43600
    },
    {
      id: 3,
      idNo: 'LDS-000003',
      branch: {
        id: 103,
        idNo: 'BR-003',
        name: 'สาขาร้อยเอ็ด',
        status: 'INACTIVE'
      },
      amount: 12,
      principal: 640000,
      interest: 57600,
      principalWithInterest: 697600,
      installment: 29066.67
    }
  ]

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
    if (mockResponse.length) {
      items.value = mockResponse
      const totalAmount = mockResponse.reduce((sum: number, item: TSummaryItem): number => sum + (item.amount || 0), 0)
      const totalPrincipal = mockResponse.reduce((sum: number, item: TSummaryItem): number => sum + (item.principal || 0), 0)
      const totalInterest = mockResponse.reduce((sum: number, item: TSummaryItem): number => sum + (item.interest || 0), 0)
      const totalPrincipalWithInterest = mockResponse.reduce((sum: number, item: TSummaryItem): number => sum + (item.principalWithInterest || 0), 0)
      const totalInstallment = mockResponse.reduce((sum: number, item: TSummaryItem): number => sum + (item.installment || 0), 0)
      summary.value = {
        numberOfBranches: mockResponse.length,
        amount: totalAmount,
        principal: totalPrincipal,
        interest: totalInterest,
        principalWithInterest: totalPrincipalWithInterest,
        installment: totalInstallment
      }
      pagination.value.count = mockResponse.length
      pagination.value.totalPage = 1
      syncQuery({ ...normalizeFilters(filters.value) })
      return
    }
    const response = await LoanDisbursementSummaryService.getLoanDisbursementSummaryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      amount: response?.amount || 0,
      numberOfBranches: response?.numberOfBranches || 0,
      principal: response?.principal || 0,
      interest: response?.interest || 0,
      principalWithInterest: response?.principalWithInterest || 0,
      installment: response?.installment || 0
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
