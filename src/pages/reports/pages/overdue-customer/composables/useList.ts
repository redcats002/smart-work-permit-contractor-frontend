import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IOverdueCustomerFilter } from '@/models/modules/report/overdue-customer/Filter.model'
import type { IGetOverdueCustomerList } from '@/models/request/report/overdue-customer/OverdueCustomerReq.model'
import type { IOverdueCustomerList, IOverdueCustomerSummary } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import OverdueCustomerProvider, { type IOverdueCustomerProvider } from '@/resources/provider/report/OverdueCustomer.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IOverdueCustomerFilter>
  items: Ref<IOverdueCustomerList[]>
  summary: Ref<IOverdueCustomerSummary>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const OverdueCustomerService: IOverdueCustomerProvider = new OverdueCustomerProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IOverdueCustomerFilter>({})
  const items = ref<IOverdueCustomerList[]>([])
  const summary = ref<IOverdueCustomerSummary>(initSummary())

  const paginateQuery = computed((): IGetOverdueCustomerList => {
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...filters.value
    }
  })

  async function useFetch (): Promise<void> {
    const response = await OverdueCustomerService.getOverdueCustomerPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = initSummary(response.summary)
    syncQuery({ ...filters.value })
  }

  function initSummary (data?: IOverdueCustomerSummary): IOverdueCustomerSummary {
    return {
      principal: data?.principal || 0,
      principalAndInterest: data?.principalAndInterest || 0,
      amountPaid: data?.amountPaid || 0,
      outstandingPrincipal: data?.outstandingPrincipal || 0,
      overdueOutstandingAmount: data?.overdueOutstandingAmount || 0,
      overdueOutstandingCount: data?.overdueOutstandingCount || 0
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
