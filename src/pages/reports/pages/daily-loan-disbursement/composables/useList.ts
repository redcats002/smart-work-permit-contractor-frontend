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
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const DailyLoanDisbursementService: IDailyLoanDisbursementProvider = new DailyLoanDisbursementProvider()

  const route = useRoute()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyLoanDisbursementFilter>({
    categoryId: route?.query?.categoryId ? Number(route.query.categoryId) : undefined,
    paymentTypeId: route?.query?.paymentTypeId ? Number(route.query.paymentTypeId) : undefined
  })
  const items = ref<IDailyLoanDisbursementList[]>([])
  const summary = ref<IDailyLoanDisbursementSummary>({
    installment: 0,
    interest: 0,
    numberOfCustomer: 0,
    operation: 0,
    total: 0,
    totalWithInterest: 0
  })
  // mock
  const mockResponse: IDailyLoanDisbursementList[] = [
    {
      id: 1,
      idNo: 'DLD-000001',
      createdAt: '2026-03-01T09:30:00.000Z',
      contract: {
        id: 1001,
        idNo: 'CT-2026-0001'
      } as any,
      receipt: {
        id: 2001,
        idNo: 'RCPT-000001'
      } as any,
      customer: {
        id: 3001,
        titleName: 'MR',
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phoneNumber: '0812345678',
        customerGroup: { id: 1, name: 'ลูกค้าทั่วไป' },
        status: 'ACTIVE'
      } as any,
      interest: 2400,
      total: 120000,
      totalWithInterest: 122400,
      operation: 1500,
      installment: 5100,
      numberOfInstallments: 24
    },
    {
      id: 2,
      idNo: 'DLD-000002',
      createdAt: '2026-03-01T10:15:00.000Z',
      contract: {
        id: 1002,
        idNo: 'CT-2026-0002'
      } as any,
      receipt: {
        id: 2002,
        idNo: 'RCPT-000002'
      } as any,
      customer: {
        id: 3002,
        titleName: 'MRS',
        firstName: 'พัชรี',
        lastName: 'ทองดี',
        phoneNumber: '0891234567',
        customerGroup: { id: 2, name: 'ลูกค้าประจำ' },
        status: 'ACTIVE'
      } as any,
      interest: 1800,
      total: 95000,
      totalWithInterest: 96800,
      operation: 1200,
      installment: 4300,
      numberOfInstallments: 24
    },
    {
      id: 3,
      idNo: 'DLD-000003',
      createdAt: '2026-03-01T11:00:00.000Z',
      contract: {
        id: 1003,
        idNo: 'CT-2026-0003'
      } as any,
      receipt: {
        id: 2003,
        idNo: 'RCPT-000003'
      } as any,
      customer: {
        id: 3003,
        titleName: 'MS',
        firstName: 'กานต์พิชชา',
        lastName: 'แสงทอง',
        phoneNumber: '0861112233',
        customerGroup: { id: 1, name: 'ลูกค้าทั่วไป' },
        status: 'ACTIVE'
      } as any,
      interest: 3200,
      total: 175000,
      totalWithInterest: 178200,
      operation: 1700,
      installment: 7300,
      numberOfInstallments: 30
    }
  ]

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
      summary.value = {
        numberOfCustomer: mockResponse.length,
        installment: mockResponse.reduce((sum: number, item: IDailyLoanDisbursementList): number => sum + item.installment, 0),
        interest: mockResponse.reduce((sum: number, item: IDailyLoanDisbursementList): number => sum + item.interest, 0),
        operation: mockResponse.reduce((sum: number, item: IDailyLoanDisbursementList): number => sum + item.operation, 0),
        total: mockResponse.reduce((sum: number, item: IDailyLoanDisbursementList): number => sum + item.total, 0),
        totalWithInterest: mockResponse.reduce((sum: number, item: IDailyLoanDisbursementList): number => sum + item.totalWithInterest, 0)
      }
      pagination.value.count = mockResponse.length
      pagination.value.totalPage = 1
      return
    }
    const response = await DailyLoanDisbursementService.getDailyLoanDisbursementPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      numberOfCustomer: response?.numberOfCustomer || 0,
      installment: response?.installment || 0,
      interest: response?.interest || 0,
      operation: response?.operation || 0,
      total: response?.total || 0,
      totalWithInterest: response?.totalWithInterest || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IDailyLoanDisbursementFilter): Partial<IDailyLoanDisbursementFilter> {
    return {
      ...value
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
