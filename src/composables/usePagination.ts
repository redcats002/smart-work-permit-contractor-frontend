import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type TPaginationLimit = 5 | 10 | 50 | 100 | number
type TSortOrder = 'asc' | 'desc'

export interface IPaginationRequest {
  page?: number
  limit?: TPaginationLimit | 9999
}
export interface ISortByRequest {
  sortBy?: string
  sortOrder?: TSortOrder
}

export interface IPagination extends IPaginationRequest {
  totalPage: number
  count: number
}

export interface IUseSyncQueryPayload {
  pagination?: IPagination
  search?: string
  sortBy?: string
  sortOrder?: TSortOrder
  [key: string]: unknown
}


export function useExtractPagination (input?: Partial<IPagination>): IPagination {
  return {
    page: input?.page ?? 1,
    limit: input?.limit ?? 10,
    count: input?.count ?? 0,
    totalPage: input?.totalPage ?? 1
  }
}

export function useInitPagination (): IPagination {
  const route = useRoute()
  return {
    page: route?.query?.page ? Number(route.query.page) : 1,
    totalPage: 1,
    count: 0,
    limit: route?.query?.limit ? Number(route.query.limit) : 10
  }
}
export interface IUsePagination {
  search: Ref<string>
  sortBy: Ref<string>
  sortOrder: Ref<TSortOrder>
  pagination: Ref<IPagination>
  extractPagination: (input?: Partial<IPagination>) => IPagination
  syncQuery (payload?: IUseSyncQueryPayload): Record<string, unknown>
}

export function usePagination (): IUsePagination {
  const route = useRoute()
  const router = useRouter()

  const sortBy = ref<string>(route?.query?.sortBy as string || '')
  const sortOrder = ref<TSortOrder>((route?.query?.sortOrder as TSortOrder) || 'desc')
  const search = ref<string>((route?.query?.search as string) || '')
  const pagination = ref<IPagination>(useInitPagination())

  function useSyncQuery (payload?: IUseSyncQueryPayload): Record<string, unknown> {
    const { pagination: _pagination, search: _search, sortBy: _sortBy, sortOrder: _sortOrder, ...rest } = payload || {}
    const query = {
      ...rest,
      page: _pagination?.page || pagination.value.page,
      limit: _pagination?.limit || pagination.value.limit,
      search: _search || search.value,
      sortBy: _sortBy || sortBy.value,
      sortOrder: _sortOrder || sortOrder.value
    }
    router.replace({ query: { ...router.currentRoute.value.query, ...query } })
    return query
  }

  return {
    search,
    sortBy,
    sortOrder,
    pagination,
    extractPagination: useExtractPagination,
    syncQuery: useSyncQuery
  }
}

interface IUseLocalPagination<T> extends IUsePagination {
  displayItems: Ref<T[]>
  updateItems(updateItems: T[]): void
  updatePagination(): void
}

export function useLocalPagination<T> (inputItems: T[] = []): IUseLocalPagination<T> {
  const { search, sortBy, sortOrder, pagination, extractPagination, syncQuery } = usePagination()

  const items = ref<T[]>([]) as Ref<T[]>
  const displayItems = ref<T[]>([]) as Ref<T[]>

  function updatePagination (): void {
    const startItem = ((pagination.value?.page ?? 1) - 1) * (pagination.value?.limit ?? 10)
    const endItem = (pagination.value?.page ?? 1) * (pagination.value?.limit ?? 10)
    displayItems.value = items.value.slice(startItem, endItem)
  }

  function updateItems (updateItems: T[] = []): void {
    items.value = [...updateItems]
    pagination.value.count = updateItems.length
    pagination.value.totalPage = Math.ceil(pagination.value.count / (pagination.value?.limit ?? 10)) || 1
    updatePagination()
  }

  updateItems(inputItems)
  syncQuery({ pagination: pagination.value, search: search.value, sortBy: sortBy.value, sortOrder: sortOrder.value })

  return {
    search,
    sortBy,
    sortOrder,
    pagination,
    extractPagination,
    displayItems,
    updateItems,
    updatePagination,
    syncQuery
  }
}

export default usePagination
