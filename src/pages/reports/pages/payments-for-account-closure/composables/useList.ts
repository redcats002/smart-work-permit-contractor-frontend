import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAccountClosureFilter } from '@/models/modules/report/account-closure/Filter.model'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

// import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'

interface IUseList extends IUsePagination {
  filters: Ref<IAccountClosureFilter>
  items: Ref<IAccountClosureList[]>
  itemsFinance: Ref<IAccountClosureList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IAccountClosureFilter>({})
  const items = ref<IAccountClosureList[]>([])
  const itemsFinance = ref<IAccountClosureList[]>([])
  // mock
  const mockResponse = {
    data: [
      {
        id: 1,
        date: '2026-05-20T14:30:00Z',
        receipt: {
          id: 0,
          idNo: 'RCPT-00001'
        },
        contract: {
          id: 0,
          idNo: 'LC-00001'
        },
        customer: {
          titleName: 'MR',
          firstName: 'จันทร์',
          lastName: 'พงษ์พัฒนโยธิน'
        },
        items: [
          {
            paymentMethod: 'ปิดบัญชีก่อนกำหนด',
            cutBalance: 120000,
            discount: 120000,
            total: 120000
          },
          {
            paymentMethod: 'ค่าประกันไถ่ถอน ที่ดิน',
            cutBalance: 120000,
            discount: 120000,
            total: 120000
          }
        ],
        interest: 120000,
        category: 'อสังหาริมทรัพย์ - ที่ดิน'
      },
      {
        id: 2,
        date: '2026-05-20T14:30:00Z',
        receipt: {
          id: 0,
          idNo: 'RCPT-00002'
        },
        contract: {
          id: 0,
          idNo: 'LC-00002'
        },
        customer: {
          titleName: 'MR',
          firstName: 'พันธนา',
          lastName: 'จิรวราภงษ์'
        },
        items: [
          {
            paymentMethod: 'ปิดบัญชีก่อนกำหนด',
            cutBalance: 120000,
            discount: 120000,
            total: 120000
          },
          {
            paymentMethod: 'ค่าประกันไถ่ถอน ที่ดิน',
            cutBalance: 120000,
            discount: 120000,
            total: 120000
          }
        ],
        interest: 120000,
        category: 'อสังหาริมทรัพย์ - ที่ดิน'
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
    itemsFinance.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IAccountClosureFilter): Partial<IAccountClosureFilter> {
    return {
      ...value
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
    reset()
  }

  return {
    filters,
    items,
    itemsFinance,
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
