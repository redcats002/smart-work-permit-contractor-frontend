import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IContractSecurityDocumentReportFilter } from '@/models/modules/report/contract-security-document/Filter.model'
import type { IContractSecurityDocumentReportList, TGetContractSecurityDocumentReportListResponse } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IContractSecurityDocumentReportFilter>
  items: Ref<IContractSecurityDocumentReportList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IContractSecurityDocumentReportFilter>({})
  const items = ref<IContractSecurityDocumentReportList[]>([])
  // mock
  const mockResponse: TGetContractSecurityDocumentReportListResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        contractAmount: 200,
        accountClosedAmount: 75,
        remainingAmount: 125,
        landTitleDeedAmount: 100,
        ns3gor: 20,
        ns3: 40,
        car: 40,
        motorcycle: 40
      },
      {
        id: 2,
        branchName: 'สำนักงานใหญ่2',
        contractAmount: 201,
        accountClosedAmount: 71,
        remainingAmount: 121,
        landTitleDeedAmount: 1001,
        ns3gor: 21,
        ns3: 10,
        car: 10,
        motorcycle: 10
      },
      {
        id: 3,
        branchName: 'สำนักงานใหญ่3',
        contractAmount: 244,
        accountClosedAmount: 44,
        remainingAmount: 44,
        landTitleDeedAmount: 44,
        ns3gor: 44,
        ns3: 41,
        car: 12,
        motorcycle: 12
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


  function normalizeFilters (value: IContractSecurityDocumentReportFilter): Partial<IContractSecurityDocumentReportFilter> {
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
