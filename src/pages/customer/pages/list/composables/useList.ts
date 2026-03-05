import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCustomerList } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetCustomerList>
  items: Ref<ICustomerList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IUseList {
  const CustomerService: ICustomerProvider = new CustomerProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetCustomerList>({})
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
    const mock = true // TODO: remove mock when api ready
    if (mock) {
      items.value = [
        {
          id: 1,
          phoneNumber: '0888888888',
          phoneNumber2: '0888888889',
          customerGroup: { label: 'ลูกค้าใหม่', value: 0 },
          customerStatus: 'ACTIVE',
          firstName: 'จันทร์',
          lastName: 'พงษ์พัฒนโยธิน',
          idNo: 'CUS-00001',
          titleName: 'MR'
        },
        {
          id: 2,
          phoneNumber: '0888888888',
          customerGroup: { label: 'กลุ่มชำระล่าช้า', value: 0 },
          customerStatus: 'IN_ACTIVE',
          firstName: 'จันทร์',
          lastName: 'พงษ์พัฒนโยธิน',
          idNo: 'CUS-00002',
          titleName: 'MR'
        }
      ]
      return
    }
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
