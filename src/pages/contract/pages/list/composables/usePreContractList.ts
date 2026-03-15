import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetPreContractList } from '@/models/request/pre-contract/PreContractReq.model'
import type { IPreContractList } from '@/models/response/pre-contract/PreContractRes.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUsePreContractList extends IUsePagination {
  filters: Ref<IGetPreContractList>
  items: Ref<IPreContractList[]>
  fetch(): void
  onClearFilters(): void
}

export default function usePreContractList (): IUsePreContractList {
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
    const mock = true // TODO: remove mock when api ready
    if (mock === true) {
      items.value = [
        {
          id: 1,
          idNo: 'PC-2569-0001',
          createdAt: '2026-01-10T08:00:00.000Z',
          updatedAt: '2026-01-10T08:00:00.000Z',
          contractDate: '2026-01-10',
          startDate: '2026-01-10',
          endDate: '2027-01-10',
          amount: 150000,
          status: 'IN_PROGRESS',
          assetStatus: 'PENDING',
          customer: { id: 1, titleName: 'MR', firstName: 'สมชาย', lastName: 'ใจดี' },
          loanType: { id: 1, name: 'จำนำทะเบียนรถ' }
        },
        {
          id: 2,
          idNo: 'PC-2569-0002',
          createdAt: '2026-02-05T09:30:00.000Z',
          updatedAt: '2026-02-05T09:30:00.000Z',
          contractDate: '2026-02-05',
          startDate: '2026-02-05',
          endDate: '2027-02-05',
          amount: 80000,
          status: 'IN_PROGRESS',
          assetStatus: 'IN_ASSESSMENT',
          customer: { id: 2, titleName: 'MRS', firstName: 'สมหญิง', lastName: 'รักดี' },
          loanType: { id: 2, name: 'จำนำโฉนดที่ดิน' }
        },
        {
          id: 3,
          idNo: 'PC-2569-0003',
          createdAt: '2026-03-01T11:00:00.000Z',
          updatedAt: '2026-03-01T11:00:00.000Z',
          contractDate: '2026-03-01',
          startDate: null,
          endDate: null,
          amount: 200000,
          status: null,
          assetStatus: 'DRAFT',
          customer: { id: 3, titleName: 'MS', firstName: 'วิไล', lastName: 'มั่นคง' },
          loanType: { id: 1, name: 'จำนำทะเบียนรถ' }
        }
      ]
      return
    }
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
