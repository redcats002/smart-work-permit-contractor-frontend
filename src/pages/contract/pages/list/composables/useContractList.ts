import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBaseOption } from '@/models/Global.model'
import type { IGetContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractList } from '@/models/response/contract/ContractRes.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseContractList extends IUsePagination {
  filters: Ref<IGetContractList>
  items: Ref<IContractList[]>
  loanTypeOptions: Ref<IBaseOption[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useContractList (): IUseContractList {
  const route = useRoute()
  const ContractService: IContractProvider = new ContractProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IGetContractList>({
    branchId: route?.query.branchId as string || undefined,
    status: route?.query.status as TContractStatus || undefined,
    contractLoanTypeId: route?.query.contractLoanTypeId ? Number(route?.query.contractLoanTypeId) : undefined
  })
  const items = ref<IContractList[]>([])
  const loanTypeOptions = ref<IBaseOption[]>([])

  const paginateQuery = computed((): IGetContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: filters.value.status,
    contractLoanTypeId: filters.value.contractLoanTypeId,
    branchId: filters.value?.branchId
  }))

  async function useFetch (): Promise<void> {
    const response = await ContractService.getContractPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({
      status: filters.value.status,
      contractLoanTypeId: filters.value.contractLoanTypeId
    })
  }


  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
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
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
