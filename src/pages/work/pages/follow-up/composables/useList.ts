import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetCompleteWorkAssetFollowUpList, IGetNewWorkAssetFollowUpList } from '@/models/request/work/WorkReq.model'
import type { IFollowUpCompleteWorkList, IFollowUpNewWorkList } from '@/models/response/work/WorkRes.model'
import type { IWorkProvider } from '@/resources/provider/work/Work.provider'
import WorkProvider from '@/resources/provider/work/Work.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { TFollowUpTab } from './useInit'

type TFollowUpList = IFollowUpNewWorkList | IFollowUpCompleteWorkList
type TGetFollowUpList = IGetNewWorkAssetFollowUpList | IGetCompleteWorkAssetFollowUpList

interface IUseList extends IUsePagination {
  filters: Ref<TGetFollowUpList>
  items: Ref<TFollowUpList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (tab: Ref<TFollowUpTab>): IUseList {
  const WorkService: IWorkProvider = new WorkProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<TGetFollowUpList>({})
  const items = ref<TFollowUpList[]>([])

  const paginateQuery = computed((): TGetFollowUpList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const fetchFn = tab.value === 'NewWork'
      ? () => WorkService.getWorkFollowUpNewPaginate(paginateQuery.value)
      : () => WorkService.getWorkFollowUpCompletePaginate(paginateQuery.value)

    const response = await fetchFn()
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: TGetFollowUpList): Partial<TGetFollowUpList> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    filters.value = {} as TGetFollowUpList
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
