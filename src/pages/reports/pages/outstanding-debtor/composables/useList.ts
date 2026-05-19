import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IOutstandingDebtorFilter } from '@/models/modules/report/outstanding-debtor/Filter.model'
import type { IGetOutstandingDebtorList } from '@/models/request/report/outstanding-debtor/OutstandingDebtorReq.model'
import type { IOutstandingDebtorList, IOutStandingDebtorSummary } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import { ContractStatusEnum, type TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import OutstandingDebtorProvider, { type IOutstandingDebtorProvider } from '@/resources/provider/report/OutstandingDebtor.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IOutstandingDebtorFilter>
  items: Ref<IOutstandingDebtorList[]>
  summary: Ref<IOutStandingDebtorSummary>
  fetch(): void
  onClearFilters(): void
}

export default function useList (fixedStatus?: TContractStatus): IUseList {
  const OutstandingDebtorService: IOutstandingDebtorProvider = new OutstandingDebtorProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IOutstandingDebtorFilter>({})
  const items = ref<IOutstandingDebtorList[]>([])
  const summary = ref<IOutStandingDebtorSummary>({
    principal: 0,
    installmentCount: 0,
    principalAndInterest: 0,
    monthlyInstallment: 0,
    amountPaid: 0,
    outstanding: 0,
    latestPaymentAmount: 0
  })

  const paginateQuery = computed((): IGetOutstandingDebtorList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value || undefined,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      status: fixedStatus,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await OutstandingDebtorService.getOutstandingDebtorPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      principal: response?.summary?.principal || 0,
      installmentCount: response?.summary?.installmentCount || 0,
      principalAndInterest: response?.summary?.principalAndInterest || 0,
      monthlyInstallment: response?.summary?.monthlyInstallment || 0,
      amountPaid: response?.summary?.amountPaid || 0,
      outstanding: response?.summary?.outstanding || 0,
      latestPaymentAmount: response?.summary?.latestPaymentAmount || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (
    value: IOutstandingDebtorFilter
  ): Partial<IOutstandingDebtorFilter> {
    const result: Partial<IOutstandingDebtorFilter> = { ...value }
    delete result.status
    return result
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  return {
    filters,
    items,
    summary,
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

export function useOutstandingDebtorList (): ReturnType<typeof useList> {
  return useList(ContractStatusEnum.PENDING)
}

export function useSuccessDebtorList (): ReturnType<typeof useList> {
  return useList(ContractStatusEnum.CLOSE_CONTRACT)
}

export function useAllDebtorList (): ReturnType<typeof useList> {
  return useList()
}
