import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IGetDailySummaryList } from '@/models/request/report/daily-summary/DailySummary.model'
import type { IDailySummaryList } from '@/models/response/report/daily-summary/DailySummaryRes'

interface IDailySummary extends IUsePagination {
  filters: Ref<IGetDailySummaryList>
  items: Ref<IDailySummaryList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IDailySummary {
  // const DeilyInstallmentService: any = new Provider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetDailySummaryList>({})
  const items = ref<IDailySummaryList[]>([])

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
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่ (กรุงเทพฯ)',
        contractCount: 150,
        principalAmount: 1500000,
        principalWithInterest: 1850000,
        debtCutOff: 200000,
        discount: 15000,
        currentBalance: 1635000,
        date: '2026-03-20T14:30:00'
      },
      {
        id: 2,
        branchName: 'สาขาขอนแก่น',
        contractCount: 85,
        principalAmount: 750000,
        principalWithInterest: 920000,
        debtCutOff: 50000,
        discount: 5000,
        currentBalance: 865000,
        date: '2026-03-20T14:30:00'
      },
      {
        id: 3,
        branchName: 'สาขาเชียงใหม่',
        contractCount: 120,
        principalAmount: 1200000,
        principalWithInterest: 1480000,
        debtCutOff: 100000,
        discount: 10000,
        currentBalance: 1370000,
        date: '2026-03-20T14:30:00'
      }
    ],
    total: 3,
    lastPage: 1,
    perPage: pagination.value.limit || 10,
    currentPage: pagination.value.page || 1
  }
  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    // pagination.value = extractPagination(response)
    const response = mockResponse as any

    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    console.log(id)
    // await DeilyInstallmentService.deleteDeilyInstallment(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
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
    syncQuery
  }
}
