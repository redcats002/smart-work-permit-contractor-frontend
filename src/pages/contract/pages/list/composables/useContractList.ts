import { computed, onMounted, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBaseOption } from '@/models/Global.model'
import type { IGetContractList } from '@/models/request/contract/ContractReq.model'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import type { IContractList } from '@/models/response/contract/ContractRes.model'
import ContractLoanTypeProvider from '@/resources/provider/contract-loan-type/ContractLoanType.provider'
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
  const loanTypeService = new ContractLoanTypeProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetContractList>({})
  const items = ref<IContractList[]>([])
  const loanTypeOptions = ref<IBaseOption[]>([])

  const paginateQuery = computed((): IGetContractList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    tab: 'CONTRACT',
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

  async function fetchLoanTypes (): Promise<void> {
    const response = await loanTypeService.getContractLoanTypePaginate({ limit: 100 })
    loanTypeOptions.value = (response?.data || []).map(
      (item: IContractLoanTypeList): IBaseOption => ({
        label: item.name,
        value: item.id
      })
    )
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    fetch()
  }

  onMounted((): void => {
    handleLoading(fetchLoanTypes)
  })

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
