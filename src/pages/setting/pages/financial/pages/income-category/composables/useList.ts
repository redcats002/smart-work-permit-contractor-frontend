import { ref, type Ref } from 'vue'
import type { IFinanceIncomeCategoryList } from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { DataTableRowClickEvent } from 'primevue'
import useListCategory from '../composables/category/useList'
import useListType from '../composables/type/useList'

interface IUseList {
  category: ReturnType<typeof useListCategory>
  type: ReturnType<typeof useListType>
  selectCategoryId: Ref<number | null>
  onDeleteCategory (id: TBaseParamsId): Promise<void>
  onSelectCategory: (event: DataTableRowClickEvent<IFinanceIncomeCategoryList>) => Promise<void>
}

export default function useList (): IUseList {
  const selectCategoryId = ref<number | null>(null)

  const category = useListCategory()
  const type = useListType(selectCategoryId)

  async function onDeleteCategory (id: TBaseParamsId): Promise<void> {
    await category.useDelete(id)
    type.reset()
    selectCategoryId.value = null
    category.fetch()
  }
  async function onSelectCategory ({ data }: DataTableRowClickEvent<IFinanceIncomeCategoryList>): Promise<void> {
    selectCategoryId.value = typeof data?.id === 'number' ? data.id : null
    await type.useFetch()
  }
  return { category, type, selectCategoryId, onSelectCategory, onDeleteCategory }
}
