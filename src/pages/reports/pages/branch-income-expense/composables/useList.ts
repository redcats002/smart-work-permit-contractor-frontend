import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBranchIncomeExpenseFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import type { IGetBranchIncomeExpenseList } from '@/models/request/report/branch-income-expense/BranchIncomeExpenseReq.model'
import type { IBranchIncomeExpenseList, IBranchIncomeExpenseSummary } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import BranchIncomeExpenseProvider from '@/resources/provider/report/BranchIncomeExpense.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IBranchIncomeExpenseFilter>
  items: Ref<IBranchIncomeExpenseList[]>
  summary: Ref<IBranchIncomeExpenseSummary>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const BranchIncomeExpenseService = new BranchIncomeExpenseProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<IBranchIncomeExpenseFilter>({
    transactionType: 'INCOME_EXPENSE',
    financeCategory: 'OVERALL'
  })
  const items = ref<IBranchIncomeExpenseList[]>([])
  const summary = ref<IBranchIncomeExpenseSummary>({
    totalExpense: 0,
    totalIncome: 0
  })
  // mock
  const mockResponse: IBranchIncomeExpenseList[] = [
    {
      id: 1,
      idNo: 'FIN-000001',
      category: {
        id: 1,
        name: 'ค่าสาธารณูปโภค'
      },
      income: 15000,
      expense: 4200
    },
    {
      id: 2,
      idNo: 'FIN-000002',
      category: {
        id: 2,
        name: 'รายได้ค่าธรรมเนียม'
      },
      income: 9800,
      expense: 1500
    },
    {
      id: 3,
      idNo: 'FIN-000003',
      category: {
        id: 3,
        name: 'ค่าใช้จ่ายสำนักงาน'
      },
      income: 3200,
      expense: 5600
    },
    {
      id: 4,
      idNo: 'FIN-000004',
      category: {
        id: 4,
        name: 'ค่าบริหารจัดการ'
      },
      income: 4100,
      expense: 2700
    }
  ]

  const paginateQuery = computed((): IGetBranchIncomeExpenseList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    if (mockResponse.length) {
      items.value = mockResponse
      summary.value = {
        totalIncome: mockResponse.reduce((sum: number, item: IBranchIncomeExpenseList): number => sum + (item.income || 0), 0),
        totalExpense: mockResponse.reduce((sum: number, item: IBranchIncomeExpenseList): number => sum + (item.expense || 0), 0)
      }
      pagination.value.count = mockResponse.length
      pagination.value.totalPage = 1
      return
    }
    const response = await BranchIncomeExpenseService.getBranchIncomeExpensePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    summary.value = {
      totalExpense: response?.totalExpense || 0,
      totalIncome: response?.totalIncome || 0
    }
    syncQuery({ ...normalizeFilters(filters.value) })
  }

  function normalizeFilters (value: IBranchIncomeExpenseFilter): Partial<IBranchIncomeExpenseFilter> {
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
    filters.value = {}
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    summary,
    fetch,
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
