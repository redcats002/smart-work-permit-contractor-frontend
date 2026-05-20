import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IRankLendingFilter } from '@/models/modules/report/rank-lending/Filter.model'
import type { IRankLendingList } from '@/models/response/report/rank-lending/RankLendingRes.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IRankLendingFilter>
  items: Ref<IRankLendingList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IRankLendingFilter>({ type: 'RECEIPT_AMOUNT' })
  const items = ref<IRankLendingList[]>([])
  // mock
  const mockResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        branchIdNo: 'BR-00001',
        totalReceived: 120000,
        rankedInTopTimes: 120
      },
      {
        id: 2,
        branchName: 'ขอนแก่น',
        branchIdNo: 'BR-00002',
        totalReceived: 120000,
        rankedInTopTimes: 30
      },
      {
        id: 3,
        branchName: 'มหาสารคาม',
        branchIdNo: 'BR-00003',
        totalReceived: 120000,
        rankedInTopTimes: 98
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

  function normalizeFilters (value: IRankLendingFilter): Partial<IRankLendingFilter> {
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
