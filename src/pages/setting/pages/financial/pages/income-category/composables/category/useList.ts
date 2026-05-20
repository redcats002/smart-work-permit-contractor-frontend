import { computed, ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionFinanceIncomeTypePayload, IGetFinanceIncomeTypeList } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type { IFinanceIncomeCategoryList } from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import FinanceIncomeCategoryProvider, { type IFinanceIncomeCategoryProvider } from '@/resources/provider/finance-income-category/FinanceIncomeCategory.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import { useFormInitialValues } from '../../schema/finance-income-category.schema'

interface IUseList extends IUsePagination {
  items: Ref<IFinanceIncomeCategoryList[]>
  form: Ref<IActionFinanceIncomeTypePayload>
  useDelete: (id: TBaseParamsId) => Promise<void>
  onCreate: () => void
  onUpdate: (id: TBaseParamsId) => void
  onDelete: (id: TBaseParamsId) => void
  fetch: () => void
}

export default function useList (): IUseList {
  const FinanceIncomeCategoryService: IFinanceIncomeCategoryProvider = new FinanceIncomeCategoryProvider()

  const items = ref<IFinanceIncomeCategoryList[]>([])
  const form = ref<IActionFinanceIncomeTypePayload>(useFormInitialValues())
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const paginateQuery = computed((): IGetFinanceIncomeTypeList => {
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value
    }
  })

  async function useFetch (): Promise<void> {
    const response = await FinanceIncomeCategoryService.getFinanceIncomeCategoryPaginate(paginateQuery.value)
    items.value = response?.data || []
    pagination.value = extractPagination(response)
    syncQuery()
  }
  async function useCreate (): Promise<void> {
    await FinanceIncomeCategoryService.createFinanceIncomeCategory(form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useUpdate (id: TBaseParamsId): Promise<void> {
    await FinanceIncomeCategoryService.updateFinanceIncomeCategory(id, form.value)
    toast.success('ดำเนินการสำเร็จ')
    await useFetch()
  }
  async function useDelete (id: TBaseParamsId): Promise<void> {
    await FinanceIncomeCategoryService.deleteFinanceIncomeCategory(id)
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
    items,
    form,
    extractPagination,
    syncQuery,
    useDelete,
    onCreate,
    onUpdate,
    onDelete,
    fetch,
    reset,
    resetPagination
  }
}
