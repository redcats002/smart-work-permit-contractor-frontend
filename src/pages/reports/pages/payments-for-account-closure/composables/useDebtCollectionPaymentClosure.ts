import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAccountClosureFilter } from '@/models/modules/report/account-closure/Filter.model'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import type { IGetAccountClosureList } from '@/models/request/report/account-closure/AccountClosureReq.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import DebtCollectionPaymentClosureProvider, {
  type IDebtCollectionPaymentClosureProvider
} from '@/resources/provider/report/DebtCollectionPaymentClosure.provider'

interface IUseList extends IUsePagination {
  filters: Ref<IAccountClosureFilter>
  items: Ref<IAccountClosureList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useDebtCollectionPaymentClosure (): IUseList {
  const DebtCollectionPaymentClosureService: IDebtCollectionPaymentClosureProvider = new DebtCollectionPaymentClosureProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IAccountClosureFilter>({})
  const items = ref<IAccountClosureList[]>([])

  const paginateQuery = computed((): IGetAccountClosureList => {
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      search: search.value || undefined,
      receiptType: filters.value.receiptType || undefined,
      assetType: filters.value.assetType || undefined
    }
  })

  async function useFetch (): Promise<void> {
    const response = await DebtCollectionPaymentClosureService.getDebtCollectionPaymentClosurePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery()
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
    filters.value = {}
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
