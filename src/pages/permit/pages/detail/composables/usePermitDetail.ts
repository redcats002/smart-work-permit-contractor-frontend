import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

const PermitService: IPermitProvider = new PermitProvider()

/**
 * `GET /permits/:id/qr` answers 403 `PERMIT_NOT_ACTIVE` for anything else, so asking for a token
 * on a DRAFT would put a console error on every view of a draft. The QR panel's dashed
 * "pending approval" placeholder is the correct rendering for every other status.
 */
const QR_STATUSES: string[] = ['ACTIVE', 'FIRE_MONITOR']

export interface IUsePermitDetail {
  permit: Ref<IPermitDetail | null>
  audit: Ref<IPermitAuditEntry[]>
  qrToken: Ref<string | null>
  loading: Ref<boolean>
  loadError: Ref<string>
  hasQr: ComputedRef<boolean>
  fetchDetail (): Promise<void>
  /** Replaces the cached permit with a command response (mark-complete / close) and re-reads the audit trail. */
  applyPermit (updated: IPermitDetail): Promise<void>
}

export function usePermitDetail (id: string): IUsePermitDetail {
  const { t } = useI18n()
  const { mapError } = useApiError()

  const permit = ref<IPermitDetail | null>(null) as Ref<IPermitDetail | null>
  const audit = ref<IPermitAuditEntry[]>([]) as Ref<IPermitAuditEntry[]>
  const qrToken = ref<string | null>(null)
  const loading = ref(false)
  const loadError = ref('')

  const hasQr: ComputedRef<boolean> = computed((): boolean => qrToken.value !== null)

  async function fetchAudit (): Promise<void> {
    try {
      const response = await PermitService.audit(id)
      audit.value = response.data
    } catch (error: unknown) {
      // A missing audit trail must not blank the screen — the permit itself is still readable.
      audit.value = []
      console.error('[usePermitDetail] audit fetch failed', mapError(error).code)
    }
  }

  async function fetchQr (status: string): Promise<void> {
    if (!QR_STATUSES.includes(status)) {
      qrToken.value = null
      return
    }
    try {
      const response = await PermitService.qr(id)
      qrToken.value = response.data.token
    } catch (error: unknown) {
      qrToken.value = null
      console.error('[usePermitDetail] qr fetch failed', mapError(error).code)
    }
  }

  async function fetchDetail (): Promise<void> {
    loading.value = true
    loadError.value = ''
    try {
      const response = await PermitService.detail(id)
      permit.value = response.data
      await Promise.all([fetchAudit(), fetchQr(response.data.status)])
    } catch (error: unknown) {
      // Localized off `errorCode` — a 404 / ownership 403 carries none and falls back to
      // `error.unknown`. The backend's own `message` is never rendered.
      permit.value = null
      loadError.value = mapError(error).message
      toast.error(t('permit.detail.loadFailed'))
    } finally {
      loading.value = false
    }
  }

  async function applyPermit (updated: IPermitDetail): Promise<void> {
    permit.value = updated
    await Promise.all([fetchAudit(), fetchQr(updated.status)])
  }

  return {
    permit,
    audit,
    qrToken,
    loading,
    loadError,
    hasQr,
    fetchDetail,
    applyPermit
  }
}

export default usePermitDetail
