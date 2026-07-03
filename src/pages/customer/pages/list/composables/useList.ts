import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICustomerFilter } from '@/models/modules/customer/Filter.model'
import type { IGetCustomerList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TPersonalType } from '@/enums/modules/customer/PersonalType.enum'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<ICustomerFilter>
  items: Ref<ICustomerList[]>
  useFetch (): Promise<void>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const CustomerService: ICustomerProvider = new CustomerProvider()

  const route = useRoute()
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<ICustomerFilter>({
    customerGroupId: route?.query?.customerGroupId ? Number(route.query.customerGroupId) : undefined,
    status: route?.query?.status ? String(route.query.status) as TCustomerStatus : undefined,
    personalType: route?.query?.personalType ? String(route.query.personalType) as TPersonalType : undefined
  })
  const items = ref<ICustomerList[]>([])

  const paginateQuery = computed((): IGetCustomerList => {
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
    const response = await CustomerService.getCustomerPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    await CustomerService.deleteCustomer(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: IGetCustomerList): Partial<IGetCustomerList> {
    return {
      ...value,
      customerGroupId: filters.value?.customerGroupId,
      status: filters.value?.status,
      personalType: filters.value?.personalType
    }
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
    useFetch,
    fetch,
    onSearch,
    onClearFilters,
    onDelete,
    extractPagination,
    syncQuery,
    reset,
    resetPagination
  }
}
