import {
  // computed,
  ref,
  type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<any>
  items: Ref<any[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<any>({})
  const items = ref<any[]>([])

  // const paginateQuery = computed((): any => {
  //   const normalizedFilters = normalizeFilters(filters.value)
  //   return {
  //     search: search.value,
  //     page: pagination.value.page,
  //     limit: pagination.value.limit,
  //     sortBy: sortBy.value || undefined,
  //     sortOrder: sortOrder.value,
  //     ...normalizedFilters
  //   }
  // })
  // mockdata
  const mockResponse = {
    data: [
      {
        index: 1,
        branchName: 'สำนักงานใหญ่',
        contractCount: 125,
        principalAmount: 120000,
        principalWithInterest: 120000,
        debtCutOff: 120000,
        discount: 120000,
        currentBalance: 120000
      },
      {
        index: 2,
        branchName: 'ขอนแก่น',
        contractCount: 34,
        principalAmount: 120000,
        principalWithInterest: 120000,
        debtCutOff: 120000,
        discount: 120000,
        currentBalance: 120000
      },
      {
        index: 3,
        branchName: 'มหาสารคาม',
        contractCount: 69,
        principalAmount: 120000,
        principalWithInterest: 120000,
        debtCutOff: 120000,
        discount: 120000,
        currentBalance: 120000
      },
      {
        index: 4,
        branchName: 'ร้อยเอ็ด',
        contractCount: 11,
        principalAmount: 120000,
        principalWithInterest: 120000,
        debtCutOff: 120000,
        discount: 120000,
        currentBalance: 120000
      },
      {
        index: 5,
        branchName: 'บุรีรัมย์',
        contractCount: 667,
        principalAmount: 120000,
        principalWithInterest: 120000,
        debtCutOff: 120000,
        discount: 120000,
        currentBalance: 120000
      }
    ],
    total: 5,
    lastPage: 1,
    perPage: pagination.value.limit || 10,
    currentPage: pagination.value.page || 1
  }
  async function useFetch (): Promise<void> {
    // const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    // items.value = response?.data || []
    // pagination.value = extractPagination(response)
    const response = mockResponse as any

    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    console.log('id', id)
    // await EmployeeService.deleteEmployee(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: any): Partial<any> {
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
