import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBaseOption } from '@/models/Global.model'
import type { IGetPreContractList } from '@/models/request/pre-contract/PreContractReq.model'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseContractList extends IUsePagination {
  filters: Ref<IGetPreContractList>
  items: Ref<IPreContractList[]>
  loanTypeOptions: Ref<IBaseOption[]>
  fetch(): void
  onClearFilters(): void
}

export default function useContractList (): IUseContractList {
  const contractService: IPreContractProvider = new PreContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetPreContractList>({})
  const items = ref<IPreContractList[]>([])
  const loanTypeOptions = ref<IBaseOption[]>([])

  const paginateQuery = computed((): IGetPreContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: filters.value.status,
    loanTypeId: filters.value.loanTypeId
  }))

  async function useFetch (): Promise<void> {
    const response = await contractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({
      status: filters.value.status,
      loanTypeId: filters.value.loanTypeId
    })
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
    loanTypeOptions,
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
