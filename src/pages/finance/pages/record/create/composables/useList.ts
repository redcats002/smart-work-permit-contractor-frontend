import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetExpensesList } from '@/models/request/expenses/ExpensesReq.model'
import type { IExpensesList } from '@/models/response/expenses/ExpensesRes.model'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/Expenses.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  items: Ref<IExpensesList[]>
  fetch(): void
}

export default function useList (): IUseList {
  const expensesService: IExpensesProvider = new ExpensesProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const items = ref<IExpensesList[]>([])

  const paginateQuery = computed((): IGetExpensesList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }))

  async function useFetch (): Promise<void> {
    const response = await expensesService.getExpensesPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({})
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
    fetch,
    extractPagination,
    syncQuery,
    reset
  }
}
