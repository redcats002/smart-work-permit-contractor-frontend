import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IOutstandingDebtorFilter>
  items: Ref<IOutstandingDebtorList[]>
  summary: Ref<IOutStandingDebtorSummary>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IOutstandingDebtorFilter>({})
  const items = ref<IOutstandingDebtorList[]>([])
  // mock
  const summary = ref<IOutStandingDebtorSummary>({
    customer: 3,
    totalAmount: 12000,
    totalAmountNet: 120000,
    paid: 120000,
    outstanding: 120000,
    latestPaymentAmount: 120000
  })
  const mockResponse = {
    data: [
      {
        contract: {
          id: 0,
          idNo: 'LC-00001'
        },
        customer: {
          id: 0,
          titleName: 'MR',
          firstName: 'จันทร์',
          lastName: 'พงษ์พัฒนโยธิน'
        },
        type: 'เงินกู้ระยะสั้น',
        createdAt: '2026-03-01T09:30:00.000Z',
        contractExpirationDate: '2026-03-01T09:30:00.000Z',
        totalAmount: 12000,
        period: 12000,
        totalAmountNet: 120000,
        netPeriod: 120000,
        paid: 120000,
        outstanding: 12000,
        lastPaymentDate: '2026-03-01T09:30:00.000Z',
        latestPaymentAmount: 120000
      },
      {
        contract: {
          id: 1,
          idNo: 'LC-00002'
        },
        customer: {
          id: 1,
          titleName: 'MR',
          firstName: 'พันธนา',
          lastName: 'จิรวราภงษ์'
        },
        type: 'เงินกู้ระยะสั้น',
        createdAt: '2026-03-01T09:30:00.000Z',
        contractExpirationDate: '2026-03-01T09:30:00.000Z',
        totalAmount: 12000,
        period: 60,
        totalAmountNet: 120000,
        netPeriod: 5000,
        paid: 120000,
        outstanding: 12000,
        lastPaymentDate: '2026-03-01T09:30:00.000Z',
        latestPaymentAmount: 120000
      },
      {
        contract: {
          id: 2,
          idNo: 'LC-00003'
        },
        customer: {
          id: 3,
          titleName: 'MRS',
          firstName: 'โชติกา',
          lastName: 'ประชายศิริกุล'
        },
        type: 'เงินกู้ระยะสั้น',
        createdAt: '2026-03-01T09:30:00.000Z',
        contractExpirationDate: '2026-03-31T09:30:00.000Z',
        totalAmount: 12000,
        period: 12000,
        totalAmountNet: 120000,
        netPeriod: 120000,
        paid: 120000,
        outstanding: 12000,
        lastPaymentDate: '2026-03-01T09:30:00.000Z',
        latestPaymentAmount: 120000
      }
    ],
    total: 3,
    lastPage: 1,
    perPage: pagination.value.limit || 10,
    currentPage: pagination.value.page || 1
  }

  // const paginateQuery = computed((): IGetPercentInstallmentList => {
  //   const normalizedFilters = normalizeFilters(filters.value)
  //   return {
  //     page: pagination.value.page,
  //     limit: pagination.value.limit,
  //     sortBy: sortBy.value || undefined,
  //     sortOrder: sortOrder.value,
  //     ...normalizedFilters
  //   }
  // })

  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    const response = mockResponse as any
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    // delete
    console.log(id)
    fetch()
    toast.success('ลบสำเร็จ')
  }

  function normalizeFilters (value: IOutstandingDebtorFilter): Partial<IOutstandingDebtorFilter> {
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

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
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
    onDelete,
    extractPagination,
    syncQuery,
    reset
  }
}
