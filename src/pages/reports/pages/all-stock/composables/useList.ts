import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAllStockFilter } from '@/models/modules/report/all-stock/Filter.model'
import type { IAllStockList } from '@/models/response/report/all-stock/AllStockRes.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IAllStockFilter>
  items: Ref<IAllStockList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IAllStockFilter>({})
  const items = ref<IAllStockList[]>([])
  // mock
  const mockResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        branchStock: 200,
        headOfficeStock: 75,
        executionStock: 125,
        totalStock: 100,
        movingStock: 100,
        totalAllStock: 100
      },
      {
        id: 2,
        branchName: 'ขอนแก่น',
        branchStock: 34,
        headOfficeStock: 34,
        executionStock: 34,
        totalStock: 34,
        movingStock: 34,
        totalAllStock: 34
      },
      {
        id: 3,
        branchName: 'บุรีรัมย์',
        branchStock: 69,
        headOfficeStock: 69,
        executionStock: 69,
        totalStock: 69,
        movingStock: 69,
        totalAllStock: 69
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

  function normalizeFilters (value: IAllStockFilter): Partial<IAllStockFilter> {
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
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onSearch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset,
    resetPagination
  }
}
