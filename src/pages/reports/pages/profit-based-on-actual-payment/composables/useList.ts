import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IProfitBasedOnActualPaymentFilter } from '@/models/modules/report/profit-based-on-actual-payment/Filter.model'
import type { IGetProfitBasedOnActualPaymentList } from '@/models/request/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentReq.model'
import type { IProfitBasedOnActualPaymentList } from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import ProfitBasedOnActualPaymentProvider from '@/resources/provider/report/ProfitBasedOnActualPayment.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IProfitBasedOnActualPaymentFilter>
  items: Ref<IProfitBasedOnActualPaymentList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const ProfitBasedOnActualPaymentService = new ProfitBasedOnActualPaymentProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IProfitBasedOnActualPaymentFilter>({})
  const items = ref<IProfitBasedOnActualPaymentList[]>([])
  // mock
  const mockResponse: IProfitBasedOnActualPaymentList[] = [
    {
      id: 1,
      idNo: 'RPT-PROFIT-0001',
      branch: {
        id: 1,
        name: 'สาขาอุบลราชธานี',
        status: 'ACTIVE'
      } as any,
      receipt: {
        id: 101,
        idNo: 'RCPT-000101',
        contractId: 5001,
        contractIdNo: 'CT-2026-0001',
        receiptDate: '2026-03-01T09:30:00.000Z',
        customer: {
          id: 9001,
          idCard: '1103700000001',
          titleName: 'MR',
          firstName: 'สมชาย',
          lastName: 'ใจดี'
        },
        totalValue: 12500
      } as any,
      contract: {
        id: 5001,
        idNo: 'CT-2026-0001'
      } as any,
      numberOfContractYear: 2,
      customer: {
        id: 9001,
        titleName: 'MR',
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phoneNumber: '0812345678',
        customerGroup: { id: 1, name: 'ลูกค้าทั่วไป' },
        status: 'ACTIVE'
      } as any,
      installmentPaymentNumber: '3',
      totalPrincipal: 180000,
      totalInterest: 36000,
      installmentPaymentAmount: 12500,
      currentPrincipal: 9800,
      currentInterest: 2700
    },
    {
      id: 2,
      idNo: 'RPT-PROFIT-0002',
      branch: {
        id: 2,
        name: 'สาขาศรีสะเกษ',
        status: 'ACTIVE'
      } as any,
      receipt: {
        id: 102,
        idNo: 'RCPT-000102',
        contractId: 5002,
        contractIdNo: 'CT-2026-0002',
        receiptDate: '2026-03-02T10:15:00.000Z',
        customer: {
          id: 9002,
          idCard: '1103700000002',
          titleName: 'MRS',
          firstName: 'พัชรี',
          lastName: 'ทองดี'
        },
        totalValue: 9800
      } as any,
      contract: {
        id: 5002,
        idNo: 'CT-2026-0002'
      } as any,
      numberOfContractYear: 1,
      customer: {
        id: 9002,
        titleName: 'MRS',
        firstName: 'พัชรี',
        lastName: 'ทองดี',
        phoneNumber: '0891234567',
        customerGroup: { id: 2, name: 'ลูกค้าประจำ' },
        status: 'ACTIVE'
      } as any,
      installmentPaymentNumber: '5',
      totalPrincipal: 120000,
      totalInterest: 18000,
      installmentPaymentAmount: 9800,
      currentPrincipal: 7900,
      currentInterest: 1900
    },
    {
      id: 3,
      idNo: 'RPT-PROFIT-0003',
      branch: {
        id: 3,
        name: 'สาขายโสธร',
        status: 'ACTIVE'
      } as any,
      receipt: {
        id: 103,
        idNo: 'RCPT-000103',
        contractId: 5003,
        contractIdNo: 'CT-2026-0003',
        receiptDate: '2026-03-03T11:05:00.000Z',
        customer: {
          id: 9003,
          idCard: '1103700000003',
          titleName: 'MS',
          firstName: 'กานต์พิชชา',
          lastName: 'แสงทอง'
        },
        totalValue: 14300
      } as any,
      contract: {
        id: 5003,
        idNo: 'CT-2026-0003'
      } as any,
      numberOfContractYear: 3,
      customer: {
        id: 9003,
        titleName: 'MS',
        firstName: 'กานต์พิชชา',
        lastName: 'แสงทอง',
        phoneNumber: '0861112233',
        customerGroup: { id: 1, name: 'ลูกค้าทั่วไป' },
        status: 'ACTIVE'
      } as any,
      installmentPaymentNumber: '7',
      totalPrincipal: 250000,
      totalInterest: 62500,
      installmentPaymentAmount: 14300,
      currentPrincipal: 11200,
      currentInterest: 3100
    }
  ]

  const paginateQuery = computed((): IGetProfitBasedOnActualPaymentList => {
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
    const response = await ProfitBasedOnActualPaymentService.getProfitBasedOnActualPaymentPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IProfitBasedOnActualPaymentFilter): Partial<IProfitBasedOnActualPaymentFilter> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
