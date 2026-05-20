import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IContractSecurityDocumentReportFilter } from '@/models/modules/report/contract-security-document/Filter.model'
import type { IGetContractSecurityDocumentReportList } from '@/models/request/report/contract-security-document/ContractSecurityDocumentReq.model'
import type { IContractSecurityDocumentReportList, IContractSecurityDocumentReportSummary } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
import ContractSecurityDocumentProvider, { type IContractSecurityDocumentProvider } from '@/resources/provider/report/ContractSecurityDocument.provider'

interface IUseList extends IUsePagination {
  filters: Ref<IContractSecurityDocumentReportFilter>
  items: Ref<IContractSecurityDocumentReportList[]>
  summary: Ref<IContractSecurityDocumentReportSummary>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const ContractSecurityDocumentService: IContractSecurityDocumentProvider = new ContractSecurityDocumentProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IContractSecurityDocumentReportFilter>({})
  const items = ref<IContractSecurityDocumentReportList[]>([])
  const summary = ref<IContractSecurityDocumentReportSummary>(initSummary())

  const paginateQuery = computed((): IGetContractSecurityDocumentReportList => {
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...filters.value
    }
  })

  async function useFetch (): Promise<void> {
    const response = await ContractSecurityDocumentService.getContractSecurityDocumentPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = initSummary(response.summary)
    syncQuery({ ...filters.value })
  }

  function initSummary (data?: IContractSecurityDocumentReportSummary): IContractSecurityDocumentReportSummary {
    return {
      contractAmount: data?.contractAmount || 0,
      contractCloseAmount: data?.contractCloseAmount || 0,
      contractPendingAmount: data?.contractPendingAmount || 0,
      assetLandAmount: data?.assetLandAmount || 0,
      ns3Amount: data?.ns3Amount || 0,
      ns3kAmount: data?.ns3kAmount || 0,
      vehicle: data?.vehicle || 0,
      motorcycle: data?.motorcycle || 0
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
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
    extractPagination,
    syncQuery,
    reset
  }
}
