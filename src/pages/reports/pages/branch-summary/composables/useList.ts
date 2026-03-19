import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IBranchSummaryReportFilter } from '@/models/modules/report/branch-summary/Filter.model'
import type { IBranchSummaryReportList, TGetBranchSummaryReportListResponse } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchSummaryReportFilter>
  items: Ref<IBranchSummaryReportList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IBranchSummaryReportFilter>({})
  const items = ref<IBranchSummaryReportList[]>([])
  // mock
  const mockResponse: TGetBranchSummaryReportListResponse = {
    data: [
      {
        id: 1,
        branchNo: 'BR-00001',
        branchName: 'สำนักงานใหญ่',
        createdAt: '2023-03-12T00:00:00.000Z',
        openedTime: '2023-03-12T00:00:00.000Z'
      },
      {
        id: 2,
        branchNo: 'BR-00002',
        branchName: 'สำนักงานใหญ่2',
        createdAt: '2024-03-12T00:00:00.000Z',
        openedTime: '2024-03-12T00:00:00.000Z'
      },
      {
        id: 3,
        branchNo: 'BR-00002',
        branchName: 'สำนักงานใหญ่3',
        createdAt: '2025-03-12T00:00:00.000Z',
        openedTime: '2025-03-12T00:00:00.000Z'
      }
    ],
    page: 1,
    count: 3,
    message: 'success',
    limit: 10,
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


  function normalizeFilters (value: IBranchSummaryReportFilter): Partial<IBranchSummaryReportFilter> {
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
