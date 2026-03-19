import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetAnnouncementList } from '@/models/request/announcement/AnnouncementReq.model'
import type { IAnnouncementList } from '@/models/response/announcement/AnnouncementRes.model'
import type { IAnnouncementProvider } from '@/resources/provider/announcement/Announcement.provider'
import AnnouncementProvider from '@/resources/provider/announcement/Announcement.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetAnnouncementList>
  items: Ref<IAnnouncementList[]>
  isFinished: Ref<boolean>
  fetch(): void
  onClearFilters(): void
  loadMore(): Promise<void>
  reset(): void
}
const DEFAULT_LIMIT = 3
export default function useList (): IUseList {
  const AnnouncementService: IAnnouncementProvider = new AnnouncementProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()
  pagination.value.limit = DEFAULT_LIMIT

  const filters = ref<IGetAnnouncementList>({})
  const items = ref<IAnnouncementList[]>([])
  const isLoading = ref(false)
  const isFinished = ref(false)

  const paginateQuery = computed((): IGetAnnouncementList => {
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

  async function useFetch (isLoadMore: boolean = false): Promise<void> {
    if (isLoading.value || isFinished.value) return

    isLoading.value = true

    const response = await AnnouncementService.getAnnouncementPaginate(paginateQuery.value)

    const newItems: IAnnouncementList[] = response.data || []

    if (isLoadMore) {
      items.value = [...items.value, ...newItems]
    } else {
      items.value = newItems
    }

    pagination.value = extractPagination(response)

    if (pagination.value.page! >= pagination.value.totalPage) {
      isFinished.value = true
    }

    syncQuery({ ...normalizeFilters(filters.value) })

    isLoading.value = false
  }


  function normalizeFilters (value: IGetAnnouncementList): Partial<IGetAnnouncementList> {
    return {
      ...value
    }
  }

  function fetch (isLoadMore: boolean = false): void {
    if (!isLoadMore) {
      pagination.value.page = 1
      items.value = []
      isFinished.value = false
    }


    handleLoading((): Promise<void> => useFetch(isLoadMore))
  }

  async function loadMore (): Promise<void> {
    if (isLoading.value || isFinished.value) return

    pagination.value.page! += 1
    await useFetch(true)
  }
  function onClearFilters (): void {
    filters.value = {}
    reset()
    pagination.value.limit = DEFAULT_LIMIT
    fetch()
  }

  // function onDelete (id: number): void {
  //   handleLoading((): Promise<void> => useDelete(id))
  // }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    isFinished,
    loadMore,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery,
    reset
  }
}
