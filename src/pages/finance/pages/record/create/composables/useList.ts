import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetExpensesList } from '@/models/request/expenses/ExpensesReq.model'
import type { IExpensesList } from '@/models/response/expenses/ExpensesRes.model'
import { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/expenses.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  items: Ref<IExpensesList[]>
  fetch(): void
}

export default function useList (): IUseList {
  const expensesService: IExpensesProvider = new ExpensesProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const items = ref<IExpensesList[]>([])

  const paginateQuery = computed((): IGetExpensesList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value
  }))

  async function useFetch (): Promise<void> {
    const isNoApi = true
    if (isNoApi) {
      items.value = [
        {
          id: 0,
          contractId: 0,
          contractIdNo: 'EPS-00001',
          expensesDate: null,
          expensesType: ExpensesTypeEnum.PAY,
          type: 'A001 ค่าสาธารณูปโภค',
          category: 'A001-1 ค่าน้ำ',
          customer: null,
          totalValue: 6300
        },
        {
          id: 1,
          contractId: 1,
          contractIdNo: 'EPS-00002',
          expensesDate: null,
          expensesType: ExpensesTypeEnum.RECEIVE,
          type: 'A001 ค่าสาธารณูปโภค',
          category: 'A001-2 ค่าไฟ',
          customer: null,
          totalValue: 12300
        },
        {
          id: 2,
          contractId: 2,
          contractIdNo: 'EPS-00003',
          expensesDate: null,
          expensesType: ExpensesTypeEnum.PAY,
          type: 'A002 ค่าวัสดุ',
          category: 'A002-1 ค่าวัสดุคอมพิวเตอร์',
          customer: null,
          totalValue: 3200
        }
      ]
    } else {
      const response = await expensesService.getExpensesPaginate(paginateQuery.value)
      items.value = response?.data || []
      pagination.value = extractPagination(response)
      syncQuery({})
    }
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
    syncQuery
  }
}
