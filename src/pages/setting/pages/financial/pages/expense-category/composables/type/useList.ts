import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionFinanceExpenseTypePayload, IGetFinanceExpenseTypeList } from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type { IFinanceExpenseTypeList } from '@/models/response/finance-expense-type/FinanceExpenseTypeRes.model'
import FinanceExpenseTypeProvider, { type IFinanceExpenseTypeProvider } from '@/resources/provider/finance-expense-type/FinanceIncomeType.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-expense-category.schema'
import { useCreatePayload, useUpdatePayload } from './usePayload'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceExpenseTypeList[]>
  form: Ref<IActionFinanceExpenseTypePayload>
  useFetch: () => Promise<void>
  onCreate: () => void
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
  fetch: () => void
  reset: () => void
}

export default function useList (categoryId: Ref<number | null>): IUseList {
  const FinanceExpenseTypeService: IFinanceExpenseTypeProvider = new FinanceExpenseTypeProvider()

  const items = ref<IFinanceExpenseTypeList[]>([])
  const form = ref<IActionFinanceExpenseTypePayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const paginateQuery = computed((): IGetFinanceExpenseTypeList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      expenseCategoryId: categoryId.value || undefined
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinanceExpenseTypeService.getFinanceExpenseTypePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ incomeCategoryId: categoryId.value })
  }
  async function useCreate (): Promise<void> {
    normalizeForm()
    await FinanceExpenseTypeService.createFinanceExpenseType(useCreatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: number): Promise<void> {
    normalizeForm()
    await FinanceExpenseTypeService.updateFinanceExpenseType(id, useUpdatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: number): Promise<void> {
    await FinanceExpenseTypeService.deleteFinanceExpenseType(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  function normalizeForm (): void {
    form.value.expenseCategoryId = categoryId.value || undefined
  }
  function onCreate (): void {
    handleLoading(useCreate)
  }
  function onUpdate (id: number): void {
    handleLoading((): Promise<void> => useUpdate(id))
  }
  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
  }
  function fetch (): void {
    handleLoading(useFetch)
  }
  function reset (): void {
    items.value = []
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
    useFetch,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset
  }
}
