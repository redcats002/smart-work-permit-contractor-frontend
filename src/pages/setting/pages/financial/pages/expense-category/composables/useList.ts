import { ref, type Ref } from 'vue'
import type { IFinanceExpenseCategoryList } from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { DataTableRowClickEvent } from 'primevue'
import useListCategory from './category/useList'
import useListType from './type/useList'

interface IUseList {
  category: ReturnType<typeof useListCategory>
  type: ReturnType<typeof useListType>
  selectCategoryId: Ref<TBaseParamsId | null>
  onDeleteCategory (id: TBaseParamsId): Promise<void>
  onSelectCategory: (event: DataTableRowClickEvent<IFinanceExpenseCategoryList>) => Promise<void>
}

export default function useList (): IUseList {
  const selectCategoryId = ref<TBaseParamsId | null>(null)

  const category = useListCategory()
  const type = useListType(selectCategoryId)

  async function onDeleteCategory (id: TBaseParamsId): Promise<void> {
    await category.useDelete(id)
    type.reset()
    selectCategoryId.value = null
  }
  async function onSelectCategory ({ data }: DataTableRowClickEvent<IFinanceExpenseCategoryList>): Promise<void> {
    selectCategoryId.value = typeof data?.id === 'number' ? data.id : null
    await type.useFetch()
  }
  return { category, type, selectCategoryId, onSelectCategory, onDeleteCategory }
}
