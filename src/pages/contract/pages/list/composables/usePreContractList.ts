import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetPreContractList } from '@/models/request/pre-contract/PreContractReq.model'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUsePreContractList extends IUsePagination {
  filters: Ref<IGetPreContractList>
  items: Ref<IPreContractList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function usePreContractList (): IUsePreContractList {
  const route = useRoute()
  const ContractService: IPreContractProvider = new PreContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IGetPreContractList>({
    branchId: route.query.branchId as string || undefined,
    status: route.query.status as TPreContractStatus || undefined
  })
  const items = ref<IPreContractList[]>([])

  const paginateQuery = computed((): IGetPreContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: filters.value.status,
    branchId: filters.value.branchId
  }))

  async function useFetch (): Promise<void> {
    const response = await ContractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ status: filters.value.status, branchId: filters.value.branchId })
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
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
