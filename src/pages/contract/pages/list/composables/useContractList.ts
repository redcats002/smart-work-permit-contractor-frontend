import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBaseOption } from '@/models/Global.model'
import type { IGetContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseContractList extends IUsePagination {
  filters: Ref<IGetContractList>
  items: Ref<IContractList[]>
  loanTypeOptions: Ref<IBaseOption[]>
  fetch(): void
  onClearFilters(): void
}

export default function useContractList (): IUseContractList {
  const contractService: IContractProvider = new ContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetContractList>({})
  const items = ref<IContractList[]>([])
  const loanTypeOptions = ref<IBaseOption[]>([])

  const paginateQuery = computed((): IGetContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: filters.value.status,
    contractLoanTypeId: filters.value.contractLoanTypeId
  }))

  async function useFetch (): Promise<void> {
    const response = await contractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({
      status: filters.value.status,
      contractLoanTypeId: filters.value.contractLoanTypeId
    })
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
    loanTypeOptions,
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
