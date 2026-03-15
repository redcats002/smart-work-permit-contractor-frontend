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
    status: filters.value.status,
    loanTypeId: filters.value.loanTypeId
  }))

  async function useFetch (): Promise<void> {
    const mock = true // TODO: remove mock when api ready
    if (mock === true) {
      items.value = [
        {
          id: 1,
          idNo: 'C-2567-0001',
          contractDate: '2024-06-01T00:00:00+07:00',
          startDate: '2024-06-01T00:00:00+07:00',
          endDate: '2025-06-01T00:00:00+07:00',
          amount: 100000,
          status: 'IN_PROGRESS',
          customer: {
            titleName: 'MR',
            id: 101,
            firstName: 'สมชาย',
            lastName: 'ใจดี'
          },
          loanType: {
            id: 1,
            name: 'สินเชื่อส่วนบุคคล'
          },
          assetStatus: 'PENDING',
          createdAt: '2024-06-01T00:00:00+07:00',
          updatedAt: '2024-06-01T00:00:00+07:00',
          createdBy: {
            id: 1,
            firstName: 'Admin',
            lastName: 'User'
          },
          updatedBy: {
            id: 1,
            firstName: 'Admin',
            lastName: 'User'
          }
        }
      ]
      return
    }
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
