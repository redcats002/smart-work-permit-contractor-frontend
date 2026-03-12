import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetPreContractList } from '@/models/request/pre-contract/PreContractReq.model'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseAssetList extends IUsePagination {
  filters: Ref<IGetPreContractList>
  items: Ref<IPreContractList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useAssetList (): IUseAssetList {
  const contractService: IPreContractProvider = new PreContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetPreContractList>({})
  const items = ref<IPreContractList[]>([])

  const paginateQuery = computed((): IGetPreContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    assetStatus: filters.value.assetStatus
  }))

  async function useFetch (): Promise<void> {
    const response = await contractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ assetStatus: filters.value.assetStatus })
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
