import type { Ref } from 'vue'
import { ref } from 'vue'
import { useApiError, type IApiErrorResult } from '@/composables/useApiError'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

const PermitService: IPermitProvider = new PermitProvider()

export interface IUseResumePermit {
  loading: Ref<boolean>
  /** The server's localized verdict when the permit could not be opened for editing — never its raw `message`. */
  loadError: Ref<IApiErrorResult | undefined>
  /**
   * Fetches `id` and confirms it is actually editable, in one round trip: `PATCH /permits/:id`
   * with an empty body is a real no-op edit, so the backend's own `PERMIT_NOT_EDITABLE` (DRAFT
   * only) is the verdict this resolves against — never a client-side guess off `status`
   * (PROMPT-LOG.md standing ruling: no client rule pre-empts the server). Resolves the fetched
   * permit on success, `undefined` on failure (`loadError` carries the localized reason).
   */
  fetchEditablePermit (id: string): Promise<IPermitDetail | undefined>
}

export function useResumePermit (): IUseResumePermit {
  const { mapError } = useApiError()

  const loading = ref(false)
  const loadError = ref<IApiErrorResult | undefined>(undefined)

  async function fetchEditablePermit (id: string): Promise<IPermitDetail | undefined> {
    loading.value = true
    loadError.value = undefined
    try {
      const response = await PermitService.update(id, {})
      return response.data
    } catch (error: unknown) {
      loadError.value = mapError(error)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, loadError, fetchEditablePermit }
}

export default useResumePermit
