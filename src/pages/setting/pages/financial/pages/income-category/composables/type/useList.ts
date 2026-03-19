import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionFinanceIncomeTypePayload, IGetFinanceIncomeTypeList } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type { IFinanceIncomeTypeList } from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import FinanceIncomeTypeProvider, { type IFinanceIncomeTypeProvider } from '@/resources/provider/finance-income-type/FinanceIncomeType.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-income-category.schema'
import { useCreatePayload, useUpdatePayload } from './usePayload'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceIncomeTypeList[]>
  form: Ref<IActionFinanceIncomeTypePayload>
  useFetch: () => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
  reset: () => void
}

export default function useList (categoryId: Ref<TBaseParamsId | null>): IUseList {
  const FinanceIncomeTypeService: IFinanceIncomeTypeProvider = new FinanceIncomeTypeProvider()

  const items = ref<IFinanceIncomeTypeList[]>([])
  const form = ref<IActionFinanceIncomeTypePayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const paginateQuery = computed((): IGetFinanceIncomeTypeList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      incomeCategoryId: typeof categoryId.value === 'number' ? categoryId.value : Number(categoryId.value)
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
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    normalizeForm()
    await FinanceIncomeTypeService.updateFinanceIncomeType(id, useUpdatePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await FinanceIncomeTypeService.deleteFinanceIncomeType(id)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  function normalizeForm (): void {
    form.value.incomeCategoryId = typeof categoryId.value === 'number' ? categoryId.value : Number(categoryId.value)
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
    useFetch,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset
  }
}
