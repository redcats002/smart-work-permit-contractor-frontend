import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetEmployeeList } from '@/models/request/employee/EmployeeReq.model'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import EmployeeProvider, { type IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetEmployeeList>
  items: Ref<IEmployeeList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const EmployeeService: IEmployeeProvider = new EmployeeProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetEmployeeList>({})
  const items = ref<IEmployeeList[]>([])

  const paginateQuery = computed((): IGetEmployeeList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const response = await EmployeeService.getEmployeePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    await EmployeeService.deleteEmployee(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: IGetEmployeeList): Partial<IGetEmployeeList> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
  }

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
    syncQuery,
    reset
  }
}
