import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IExpensesFilter } from '@/models/modules/expenses/Filter'
import type { IGetExpensesList } from '@/models/request/expenses/ExpensesReq.model'
import type { IExpensesList } from '@/models/response/expenses/ExpensesRes.model'
import type { TExpensesType } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/Expenses.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IExpensesFilter>
  items: Ref<IExpensesList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const route = useRoute()
  const ExpensesService: IExpensesProvider = new ExpensesProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()
  const filters = ref<IExpensesFilter>({
    expenseCategoryId: route?.query.expenseCategoryId ? Number(route.query.expenseCategoryId) : undefined,
    expenseTypeId: route?.query.expenseTypeId ? Number(route.query.expenseTypeId) : undefined,
    type: route?.query.type ? route.query.type as TExpensesType : undefined
  })

  const items = ref<IExpensesList[]>([])

  const paginateQuery = computed((): IGetExpensesList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    expenseCategoryId: filters.value.expenseCategoryId,
    expenseTypeId: filters.value.expenseTypeId,
    type: filters.value.type
  }))

  async function useFetch (): Promise<void> {
    const response = await ExpensesService.getExpensesPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...paginateQuery.value })
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    filters,
    onClearFilters,
    fetch,
    onSearch,
    resetPagination,
    extractPagination,
    syncQuery,
    reset
  }
}
