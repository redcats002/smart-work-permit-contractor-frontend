import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractAssetFilter } from '@/models/modules/contract-asset/Filter.model'
import type { IGetContractAssetList } from '@/models/request/contract-asset/ContractAssetReq.model'
import type { IContractAssetList } from '@/models/response/contract-asset/ContractAssetRes.model'
import ContractAssetProvider from '@/resources/provider/contract-asset/ContractAsset.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IContractAssetFilter>
  items: Ref<IContractAssetList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const provider = new ContractAssetProvider()
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IContractAssetFilter>({})
  const items = ref<IContractAssetList[]>([])

  const paginateQuery = computed((): IGetContractAssetList => ({
    search: search.value || undefined,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    type: filters.value.type || undefined,
    status: filters.value.status || undefined
  }))

  async function useFetch (): Promise<void> {
    syncQuery({ ...paginateQuery.value })
    const res = await provider.getContractAssetPaginate(paginateQuery.value)
    items.value = res.data
    pagination.value = extractPagination(res)
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  function fetch (): void {
    handleLoading(useFetch)
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
