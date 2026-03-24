import { computed, ref, type Ref } from 'vue'
import type { IAssetFilter } from '@/models/modules/asset/Filter.model'
import type { IGetAssetList } from '@/models/request/asset/AssetReq.model'
import type { IAssetList } from '@/models/response/asset/AssetRes.model'
import { assetMockItems } from '@/pages/asset/mock/assetMock'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IAssetFilter>
  items: Ref<IAssetList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IAssetFilter>({})
  const items = ref<IAssetList[]>([])
  const allItems = ref<IAssetList[]>(assetMockItems)

  const paginateQuery = computed((): IGetAssetList => {
    const normalizedFilters = normalizeFilters()
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  function filterItems (): IAssetList[] {
    const keyword = search.value?.trim().toLowerCase()
    const category = filters.value.type || null
    const status = filters.value.status || null

    return allItems.value.filter((item: IAssetList): boolean => {
      if (category && item.category !== category) return false
      if (status && item.status !== status) return false

      if (!keyword) return true
      const haystack = [
        item.assetNo,
        item.customerName,
        item.category,
        String(item.value),
        item.status
      ].join(' ').toLowerCase()
      return haystack.includes(keyword)
    })
  }

  function paginateItems (list: IAssetList[]): IAssetList[] {
    const page = pagination.value.page || 1
    const limit = pagination.value.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    return list.slice(start, end)
  }

  function normalizeFilters (): Partial<IGetAssetList> {
    return {}
  }

  function fetch (): void {
    // TODO: replace with API call when asset service is ready
    syncQuery({ ...normalizeFilters() })
    const filtered = filterItems()
    pagination.value.count = filtered.length
    pagination.value.totalPage = Math.ceil(filtered.length / (pagination.value.limit || 10)) || 1
    pagination.value = extractPagination(pagination.value)
    items.value = paginateItems(filtered)
    void paginateQuery.value
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
    fetch()
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
