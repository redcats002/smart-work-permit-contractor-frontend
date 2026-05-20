import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IDailyBranchSummaryFilter } from '@/models/modules/report/daily-branch-summary/Filter.model'
import type { IDailyBranchSummaryList, TGetDailyBranchSummaryListResponse } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'

interface IUseList extends IUsePagination {
  filters: Ref<IDailyBranchSummaryFilter>
  items: Ref<IDailyBranchSummaryList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IDailyBranchSummaryFilter>({})
  const items = ref<IDailyBranchSummaryList[]>([])
  // mock
  const mockResponse: TGetDailyBranchSummaryListResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        financeReceive: 10000,
        cancellationCost: 10000,
        contractReplacementFee: 10000,
        financeRelease: 10000,
        insuranceCost: 10000,
        lawyerFee: 10000,
        processingFee: 10000,
        remainingBalance: 10000,
        sell: 10000
      },
      {
        id: 2,
        branchName: 'สำนักงานใหญ่2',
        financeReceive: 10000,
        cancellationCost: 10000,
        contractReplacementFee: 10000,
        financeRelease: 10000,
        insuranceCost: 10000,
        lawyerFee: 10000,
        processingFee: 10000,
        remainingBalance: 10000,
        sell: 10000
      },
      {
        id: 3,
        branchName: 'สำนักงานใหญ่3',
        financeReceive: 10000,
        cancellationCost: 10000,
        contractReplacementFee: 10000,
        financeRelease: 10000,
        insuranceCost: 10000,
        lawyerFee: 10000,
        processingFee: 10000,
        remainingBalance: 10000,
        sell: 10000
      }
    ],
    count: 3,
    totalPage: 1,
    limit: 10,
    page: 1,
    message: 'success'
  }


  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    const response = mockResponse as any
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IDailyBranchSummaryFilter): Partial<IDailyBranchSummaryFilter> {
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
