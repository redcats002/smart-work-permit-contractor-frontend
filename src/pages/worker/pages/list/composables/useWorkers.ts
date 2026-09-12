import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import { useApiError } from '@/composables/useApiError'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'

const WorkerService: IWorkerProvider = new WorkerProvider()

/**
 * wayfinder 062 — `/workers` list. Contractor-scoped server-side; retired workers are excluded
 * by default (the API's own default for `includeRetired`), which is what "retiring removes them
 * from suggestions and the default list" means in practice here.
 */
export interface IUseWorkers {
  items: Ref<IWorker[]>
  loading: Ref<boolean>
  search: Ref<string>
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  fetch (): Promise<void>
}

export function useWorkers (): IUseWorkers {
  const { t } = useI18n()
  const { mapError } = useApiError()
  const { search, pagination } = usePagination({ inheritQuery: false })

  const items = ref<IWorker[]>([]) as Ref<IWorker[]>
  const loading = ref(false)

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  async function useFetchWorkers (): Promise<void> {
    const response = await WorkerService.list({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value
    })
    items.value = response.data
    pagination.value.count = response.count
    pagination.value.totalPage = response.totalPage
  }

  async function fetch (): Promise<void> {
    await handleLoading(useFetchWorkers, { loadingUnit: loading }, (error: unknown): void => {
      const { message } = mapError(error)
      toast.error(message || t('worker.list.error.loadFailed'))
    })
  }

  const debouncedFetch = useDebounce((): void => {
    pagination.value.page = 1
    void fetch()
  }, 400)

  watch(search, (): void => {
    debouncedFetch()
  })

  return {
    items,
    loading,
    search,
    pagination,
    isEmpty,
    fetch
  }
}

export default useWorkers
