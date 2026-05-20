import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type {
  IActionFinanceExpenseCategoryPayload,
  IGetFinanceExpenseCategoryList
} from '@/models/request/finance-expense-category/FinanceExpenseCategoryReq.model'
import type { IFinanceExpenseCategoryList } from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import FinanceExpenseCategoryProvider, {
  type IFinanceExpenseCategoryProvider
} from '@/resources/provider/finance-expense-category/FinanceIncomeCategory.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-expense-category.schema'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceExpenseCategoryList[]>
  form: Ref<IActionFinanceExpenseCategoryPayload>
  useDelete: (id: TBaseParamsId) => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
}

export default function useList (): IUseList {
  const FinanceExpenseCategoryService: IFinanceExpenseCategoryProvider = new FinanceExpenseCategoryProvider()

  const items = ref<IFinanceExpenseCategoryList[]>([])
  const form = ref<IActionFinanceExpenseCategoryPayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetFinanceExpenseCategoryList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinanceExpenseCategoryService.getFinanceExpenseCategoryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery()
  }
  async function useCreate (): Promise<void> {
    await FinanceExpenseCategoryService.createFinanceExpenseCategory(form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    await FinanceExpenseCategoryService.updateFinanceExpenseCategory(id, form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await FinanceExpenseCategoryService.deleteFinanceExpenseCategory(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }

  function onCreate (): void {
    handleLoading(useCreate)
  }
  function onUpdate (id: TBaseParamsId): void {
    handleLoading((): Promise<void> => useUpdate(id))
  }
  function onDelete (id: TBaseParamsId): void {
    handleLoading((): Promise<void> => useDelete(id))
  }
  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    pagination,
    search,
    sortBy,
    sortOrder,
    extractPagination,
    syncQuery,
    items,
    form,
    useDelete,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset
  }
}
