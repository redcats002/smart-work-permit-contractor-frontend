import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import { useApiError } from '@/composables/useApiError'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'

const CertificateService: ICertificateProvider = new CertificateProvider()
const WorkerService: IWorkerProvider = new WorkerProvider()

export interface IUseCertificates {
  items: Ref<ICertificate[]>
  loading: Ref<boolean>
  search: Ref<string>
  workerId: Ref<number | null>
  workers: Ref<IWorker[]>
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  fetch (): Promise<void>
  fetchWorkers (): Promise<void>
}

export function useCertificates (): IUseCertificates {
  const { t } = useI18n()
  const { mapError } = useApiError()
  const { search, pagination } = usePagination({ inheritQuery: false })

  const items = ref<ICertificate[]>([]) as Ref<ICertificate[]>
  const workers = ref<IWorker[]>([]) as Ref<IWorker[]>
  const workerId = ref<number | null>(null)
  const loading = ref(false)

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  async function useFetchCertificates (): Promise<void> {
    const response = await CertificateService.list({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value.trim() || undefined,
      workerId: workerId.value ?? undefined
    })
    items.value = response.data
    pagination.value.count = response.count
    pagination.value.totalPage = response.totalPage
  }

  async function fetch (): Promise<void> {
    await handleLoading(useFetchCertificates, { loadingUnit: loading }, (error: unknown): void => {
      const { message } = mapError(error)
      toast.error(message || t('certificate.list.error.loadFailed'))
    })
  }

  /**
   * Populates the worker filter's options. Explicit `limit: 9999` — the server defaults to a
   * page size of 10 (`CommonPaginationModel`), which would silently truncate this dropdown to
   * the first page of workers (the AreaPicker lesson — docs/api CommonPaginationModel).
   */
  async function fetchWorkers (): Promise<void> {
    try {
      const response = await WorkerService.list({ limit: 9999 })
      workers.value = response.data
    } catch (error: unknown) {
      toast.error(mapError(error).message)
    }
  }

  const debouncedFetch = useDebounce((): void => {
    pagination.value.page = 1
    void fetch()
  }, 400)

  watch(search, (): void => {
    debouncedFetch()
  })

  watch(workerId, (): void => {
    pagination.value.page = 1
    void fetch()
  })

  return {
    items,
    loading,
    search,
    workerId,
    workers,
    pagination,
    isEmpty,
    fetch,
    fetchWorkers
  }
}

export default useCertificates
