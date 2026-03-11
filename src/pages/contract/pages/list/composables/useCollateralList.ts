import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseCollateralList extends IUsePagination {
  filters: Ref<IGetContractList>
  items: Ref<IContractList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useCollateralList (): IUseCollateralList {
  const contractService: IContractProvider = new ContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetContractList>({})
  const items = ref<IContractList[]>([])

  const paginateQuery = computed((): IGetContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    tab: 'COLLATERAL',
    collateralStatus: filters.value.collateralStatus
  }))

  async function useFetch (): Promise<void> {
    const response = await contractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ collateralStatus: filters.value.collateralStatus })
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    fetch()
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
    syncQuery
  }
}
