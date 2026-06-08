import { computed, ref, type Ref } from 'vue'
import { useNotificationStore } from '@/stores/Notification'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetNewWorkAssetAppraisalList } from '@/models/request/work/WorkReq.model'
import type { IAssetAppraisalCompleteWorkList, IAssetAppraisalNewWorkList } from '@/models/response/work/WorkRes.model'
import type { IWorkProvider } from '@/resources/provider/work/Work.provider'
import WorkProvider from '@/resources/provider/work/Work.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { TAssetAppraisalTab } from './useInit'

type TAssetAppraisalList = IAssetAppraisalNewWorkList | IAssetAppraisalCompleteWorkList
type TGetAssetAppraisalList = IGetNewWorkAssetAppraisalList | IGetNewWorkAssetAppraisalList
interface IUseList extends IUsePagination {
  filters: Ref<TGetAssetAppraisalList>
  items: Ref<TAssetAppraisalList[]>
  fetch(): void
  onSearch(): void
  onClearFilters(): void
}
export default function useList (tab: Ref<TAssetAppraisalTab>): IUseList {
  const WorkService: IWorkProvider = new WorkProvider()
  const notificationStore = useNotificationStore()
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset, resetPagination } = usePagination()

  const filters = ref<TGetAssetAppraisalList>({})
  const items = ref<TAssetAppraisalList[]>([])

  const paginateQuery = computed((): TGetAssetAppraisalList => {
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
      ? () => WorkService.getWorkAppraisalNewPaginate(paginateQuery.value)
      : () => WorkService.getWorkAppraisalCompletePaginate(paginateQuery.value)

    const response = await fetchFn()
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: TGetAssetAppraisalList): Partial<TGetAssetAppraisalList> {
    return {
      ...value
    }
  }

  function onSearch (): void {
    resetPagination()
    fetch()
  }

  function fetch (): void {
    handleLoading(async () => {
      await useFetch()
      await notificationStore.readWork()
    })
  }

  function onClearFilters (): void {
    filters.value = {} as TGetAssetAppraisalList
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
    onSearch,
    resetPagination,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
