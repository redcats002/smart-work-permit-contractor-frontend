import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionFinanceIncomeTypePayload, IGetFinanceIncomeTypeList } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type { IFinanceIncomeTypeList } from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import FinanceIncomeTypeProvider, { type IFinanceIncomeTypeProvider } from '@/resources/provider/finance-income-type/FinanceIncomeType.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-income-category.schema'
import { useCreatePayload, useUpdatePayload } from './usePayload'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceIncomeTypeList[]>
  form: Ref<IActionFinanceIncomeTypePayload>
  useFetch: () => Promise<void>
  onCreate: () => void
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
  fetch: () => void
  reset: () => void
}

export default function useList (categoryId: Ref<number | null>): IUseList {
  const FinanceIncomeTypeService: IFinanceIncomeTypeProvider = new FinanceIncomeTypeProvider()

  const items = ref<IFinanceIncomeTypeList[]>([])
  const form = ref<IActionFinanceIncomeTypePayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const paginateQuery = computed((): IGetFinanceIncomeTypeList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      incomeCategoryId: categoryId.value || undefined
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinanceIncomeTypeService.getFinanceIncomeTypePaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery({ incomeCategoryId: categoryId.value })
  }
  async function useCreate (): Promise<void> {
    normalizeForm()
    await FinanceIncomeTypeService.createFinanceIncomeType(useCreatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: number): Promise<void> {
    normalizeForm()
    await FinanceIncomeTypeService.updateFinanceIncomeType(id, useUpdatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: number): Promise<void> {
    await FinanceIncomeTypeService.deleteFinanceIncomeType(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  function normalizeForm (): void {
    form.value.incomeCategoryId = categoryId.value || undefined
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
