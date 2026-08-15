import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

const CertificateService: ICertificateProvider = new CertificateProvider()

export interface IUseCertificates {
  items: Ref<ICertificate[]>
  loading: Ref<boolean>
  pagination: IUsePagination['pagination']
  isEmpty: ComputedRef<boolean>
  fetch (): Promise<void>
}

export function useCertificates (): IUseCertificates {
  const { t } = useI18n()
  const { mapError } = useApiError()
  const { pagination } = usePagination({ inheritQuery: false })
  // The design shows the full set with no visible pager on this screen
  // (SmartWorkPermit-v3.dc.html lines 730-756) — a generous page size stands in
  // for paginator UI the design doesn't have, while still driving the API query.
  pagination.value.limit = 50

  const items = ref<ICertificate[]>([]) as Ref<ICertificate[]>
  const loading = ref(false)

  const isEmpty: ComputedRef<boolean> = computed((): boolean => !loading.value && items.value.length === 0)

  async function useFetchCertificates (): Promise<void> {
    const response = await CertificateService.list({
      page: pagination.value.page,
      limit: pagination.value.limit
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

  return {
    items,
    loading,
    pagination,
    isEmpty,
    fetch
  }
}

export default useCertificates
