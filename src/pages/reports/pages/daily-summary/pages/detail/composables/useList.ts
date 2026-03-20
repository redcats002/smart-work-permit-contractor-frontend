import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IGetDailySummaryDetailListRequest } from '@/models/request/report/daily-summary/DailySummaryDetail'
import type { IDailySummaryDetailList } from '@/models/response/report/daily-summary/DailySummaryDetailRes'

interface IDailySummaryDetail extends IUsePagination {
  filters: Ref<IGetDailySummaryDetailListRequest>
  items: Ref<IDailySummaryDetailList | undefined>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IDailySummaryDetail {
  // const DeilyInstallmentService: any = new Provider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetDailySummaryDetailListRequest>({})
  const items = ref<IDailySummaryDetailList>()

  // const paginateQuery = computed((): any => {
  //   const normalizedFilters = normalizeFilters(filters.value)
  //   return {
  //     search: search.value,
  //     page: pagination.value.page,
  //     limit: pagination.value.limit,
  //     sortBy: sortBy.value || undefined,
  //     sortOrder: sortOrder.value,
  //     ...normalizedFilters
  //   }
  // })

  // mock
  const mockResponse = {
    data: {
      branch: 'พญาไท',
      invoiceNo: '12312312121',
      date: '2026-03-20T14:30:00',
      items: [
        {
          id: 1,
          date: '2026-03-20T14:30:00',
          paymentCode: '102',
          categoryName: 'A001-1 ค่าน้ำ',
          transactionType: 'รับ',
          amount: 120000,
          totalAmount: 120000,
          installmentAmount: 120000,
          totalInterest: 120000,
          principalAmount: 1500000,
          currentBalance: 1635000
        },
        {
          id: 2,
          date: '2026-03-20T14:30:00',
          paymentCode: '103',
          categoryName: 'A001-2 ค่าไฟ',
          transactionType: 'รับ',
          amount: 120000,
          totalAmount: 120000,
          installmentAmount: 120000,
          totalInterest: 120000,
          principalAmount: 750000,
          currentBalance: 865000
        },
        {
          id: 3,
          date: '2026-03-20T14:30:00',
          paymentCode: '104',
          categoryName: 'A002-1 ค่าวัสดุอุปกรณ์',
          transactionType: 'รับ',
          amount: 120000,
          totalAmount: 120000,
          installmentAmount: 120000,
          totalInterest: 120000,
          principalAmount: 1200000,
          currentBalance: 1370000
        },
        {
          id: 4,
          date: '2026-03-20T14:30:00',
          paymentCode: '105',
          categoryName: 'A001-3 ค่าโทรศัพท์',
          transactionType: 'จ่าย',
          amount: 120000,
          totalAmount: 120000,
          installmentAmount: 120000,
          totalInterest: 120000,
          principalAmount: 1000000,
          currentBalance: 880000
        }
      ]
    },
    total: 4,
    lastPage: 1,
    perPage: pagination.value.limit || 10,
    currentPage: pagination.value.page || 1
  } as any
  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    // pagination.value = extractPagination(response)
    const response = mockResponse as any

    items.value = response?.data || {}
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    console.log(id)
    // await DeilyInstallmentService.deleteDeilyInstallment(id)
    fetch()
    toast.success('ลบรายการสําเร็จ')
  }

  function normalizeFilters (value: any): Partial<any> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
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
    fetch,
    onClearFilters,
    onDelete,
    extractPagination,
    syncQuery,
    reset
  }
}
