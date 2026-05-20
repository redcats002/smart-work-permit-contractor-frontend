import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionFinanceExpenseTypePayload, IGetFinanceExpenseTypeList } from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type { IFinanceExpenseTypeList } from '@/models/response/finance-expense-type/FinanceExpenseTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import FinanceExpenseTypeProvider, { type IFinanceExpenseTypeProvider } from '@/resources/provider/finance-expense-type/FinanceIncomeType.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-expense-category.schema'
import { useCreatePayload, useUpdatePayload } from './usePayload'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceExpenseTypeList[]>
  form: Ref<IActionFinanceExpenseTypePayload>
  useFetch: () => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
  reset: () => void
}

export default function useList (categoryId: Ref<TBaseParamsId | null>): IUseList {
  const FinanceExpenseTypeService: IFinanceExpenseTypeProvider = new FinanceExpenseTypeProvider()

  const items = ref<IFinanceExpenseTypeList[]>([])
  const form = ref<IActionFinanceExpenseTypePayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetFinanceExpenseTypeList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      expenseCategoryId: typeof categoryId.value === 'number' ? categoryId.value : undefined
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinanceExpenseTypeService.getFinanceExpenseTypePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ expenseCategoryId: categoryId.value })
  }
  async function useCreate (): Promise<void> {
    normalizeForm()
    await FinanceExpenseTypeService.createFinanceExpenseType(useCreatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    normalizeForm()
    await FinanceExpenseTypeService.updateFinanceExpenseType(id, useUpdatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await FinanceExpenseTypeService.deleteFinanceExpenseType(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  function normalizeForm (): void {
    form.value.expenseCategoryId = typeof categoryId.value === 'number' ? categoryId.value : undefined
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
    items,
    form,
    extractPagination,
    syncQuery,
    useFetch,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset,
    resetPagination
  }
}
