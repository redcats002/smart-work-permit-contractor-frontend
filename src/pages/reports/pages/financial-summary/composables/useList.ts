import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IFinancialSummaryReportFilter } from '@/models/modules/report/financial-summary/Filter.model'
import type { IFinancialSummaryReportList, TGetFinancialSummaryReportListResponse } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IFinancialSummaryReportFilter>
  items: Ref<IFinancialSummaryReportList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IFinancialSummaryReportFilter>({})
  const items = ref<IFinancialSummaryReportList[]>([])
  // mock
  const mockResponse: TGetFinancialSummaryReportListResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        income: null,
        expenses: 120000,
        loan: 120000
      },
      {
        id: 2,
        branchName: 'สำนักงานใหญ่2',
        income: 100001,
        expenses: 100001,
        loan: 100001
      },
      {
        id: 3,
        branchName: 'สำนักงานใหญ่3',
        income: 130000,
        expenses: null,
        loan: 130000
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


  function normalizeFilters (value: IFinancialSummaryReportFilter): Partial<IFinancialSummaryReportFilter> {
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
