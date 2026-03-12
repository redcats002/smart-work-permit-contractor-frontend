import { computed, onMounted, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBaseOption } from '@/models/Global.model'
import type { IGetPreContractList } from '@/models/request/pre-contract/PreContractReq.model'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import ContractLoanTypeProvider from '@/resources/provider/contract-loan-type/ContractLoanType.provider'
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
  const loanTypeService = new ContractLoanTypeProvider()

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
