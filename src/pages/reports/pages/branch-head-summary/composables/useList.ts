import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IBranchHeadSummaryFilter } from '@/models/modules/report/branch-head-summary/Filter.model'
import type { IBranchHeadSummaryList, TGetBranchHeadSummaryListResponse } from '@/models/response/report/branch-head-summary/BranchHeadSummaryRes.model'
// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchHeadSummaryFilter>
  items: Ref<IBranchHeadSummaryList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IBranchHeadSummaryFilter>({})
  const items = ref<IBranchHeadSummaryList[]>([])
  // mock
  const mockResponse: TGetBranchHeadSummaryListResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        costPerInstallment: 125,
        percentageCollection: 75.43,
        collectionAmount: 120000,
        releaseAmount: 120000
      },
      {
        id: 2,
        branchName: 'สำนักงานใหญ่2',
        costPerInstallment: 34,
        percentageCollection: null,
        collectionAmount: 120000,
        releaseAmount: 120000
      },
      {
        id: 3,
        branchName: 'สำนักงานใหญ่3',
        costPerInstallment: 69,
        percentageCollection: 75.43,
        collectionAmount: 120000,
        releaseAmount: 120000
      }

    ],
    page: 1,
    limit: 10,
    count: 3,
    message: 'success',
    totalPage: 1
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


  function normalizeFilters (value: IBranchHeadSummaryFilter): Partial<IBranchHeadSummaryFilter> {
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
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
