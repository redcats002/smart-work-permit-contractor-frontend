import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'

import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IPercentInstallmentList } from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import type { IPercentInstallmentFilter } from '@/models/modules/report/percent-installment/Filter.model'
// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IPercentInstallmentFilter>
  items: Ref<IPercentInstallmentList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IPercentInstallmentFilter>({})
  const items = ref<IPercentInstallmentList[]>([])
  // mock
  const mockResponse = {
    data: [
      {
        id: 1,
        branchName: 'สำนักงานใหญ่',
        installmentAmount: 120000,
        receivedInstallment: 120000,
        salesAmount: 120000,
        receivedPenalty: 120000,
        trackingFee: 120000,
        totalAmount: 120000,
        percentage: 134.98
      },
      {
        id: 2,
        branchName: 'ขอนแก่น',
        installmentAmount: 120000,
        receivedInstallment: 120000,
        salesAmount: 120000,
        receivedPenalty: 120000,
        trackingFee: 120000,
        totalAmount: 120000,
        percentage: 134.98
      },
      {
        id: 3,
        branchName: 'มหาสารคาม',
        installmentAmount: 120000,
        receivedInstallment: 120000,
        salesAmount: 120000,
        receivedPenalty: 120000,
        trackingFee: 120000,
        totalAmount: 120000,
        percentage: 134.98
      }
    ],
    total: 3,
    lastPage: 1,
    perPage: pagination.value.limit || 10,
    currentPage: pagination.value.page || 1
  }

  // const paginateQuery = computed((): IGetPercentInstallmentList => {
  //   const normalizedFilters = normalizeFilters(filters.value)
  //   return {
  //     page: pagination.value.page,
  //     limit: pagination.value.limit,
  //     sortBy: sortBy.value || undefined,
  //     sortOrder: sortOrder.value,
  //     ...normalizedFilters
  //   }
  // })

  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    const response = mockResponse as any
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    // delete
    console.log(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: IPercentInstallmentFilter): Partial<IPercentInstallmentFilter> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {}

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
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
    onDelete,
    extractPagination,
    syncQuery
  }
}
