import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetDebtCollectionList } from '@/models/request/work/WorkReq.model'
import type { IDebtCollectionList } from '@/models/response/work/WorkRes.model'
import { DebtCollectionStatusEnum } from '@/enums/modules/work/DebtCollectionStatus.enum'
import type { IWorkProvider } from '@/resources/provider/work/Work.provider'
import WorkProvider from '@/resources/provider/work/Work.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { TFollowUpTab } from './useInit'

interface IUseList extends IUsePagination {
  filters: Ref<IGetDebtCollectionList>
  items: Ref<IDebtCollectionList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useList (tab: Ref<TFollowUpTab>): IUseList {
  const WorkService: IWorkProvider = new WorkProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetDebtCollectionList>({})
  const items = ref<IDebtCollectionList[]>([])

  const paginateQuery = computed((): IGetDebtCollectionList => ({
    search: search.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    status: tab.value === 'NewWork' ? DebtCollectionStatusEnum.PENDING : DebtCollectionStatusEnum.COMPLETED,
    ...filters.value
  }))

  async function useFetch (): Promise<void> {
    const response = await WorkService.getDebtCollectionList(paginateQuery.value)
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...filters.value })
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {}
    reset()
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
