import type { Ref } from 'vue'
import { ref } from 'vue'
import { useApiError, type IApiErrorResult } from '@/composables/useApiError'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

const PermitService: IPermitProvider = new PermitProvider()

/** Mirrors `update.service.ts`'s own gate — PATCH admits DRAFT and REJECTED only. */
const EDITABLE_STATUSES: ReadonlySet<string> = new Set<string>(['DRAFT', 'REJECTED'])

export interface IUseResumePermit {
  loading: Ref<boolean>
  /** The server's localized verdict when the permit could not be opened for editing — never its raw `message`. */
  loadError: Ref<IApiErrorResult | undefined>
  /**
   * Fetches `id` and decides editability client-side from the response — a plain `GET
   * /permits/:id` (wayfinder ticket 022). This used to be an empty-body `PATCH` used purely as an
   * editability probe, which — since wayfinder 012 made `PATCH` on a PENDING permit an atomic
   * withdrawal back to DRAFT — silently withdrew a PENDING permit from review just by opening this
   * page (deep link, bookmark, refresh, back-button return; the confirm dialog on the "Edit
   * Permit" button cannot cover any of those). A read cannot mutate, so mounting this page never
   * writes anything.
   *
   * Editability itself still mirrors the server exactly: `EDITABLE_STATUSES` is the same DRAFT /
   * REJECTED set `update.service.ts` gates on (PROMPT-LOG.md: REJECTED is editable too, a
   * DRAFT-only client rule would be wrong). Ownership and existence are NOT re-implemented here —
   * `GET /permits/:id` is already scoped to the caller's own permits server-side (a 403/404 is
   * caught below exactly like before) — so nothing the old PATCH-based probe relied on the server
   * for stops being checked.
   *
   * This is convenience only, per CONTEXT.md §3: the wizard's own save still round-trips a real
   * `PATCH`, and the server's answer there is what's authoritative if the two ever disagree.
   * Resolves the fetched permit on success, `undefined` on failure (`loadError` carries the
   * localized reason).
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
      const response = await PermitService.detail(id)
      const permit = response.data
      if (!EDITABLE_STATUSES.has(permit.status)) {
        // Manufacture the same verdict the old PATCH-based probe would have gotten back from the
        // server for this exact case — `mapError` only inspects shape (`code`/`errorCode`), so this
        // localizes identically to a real 403 PERMIT_NOT_EDITABLE response.
        loadError.value = mapError({ code: 403, errorCode: EApiErrorCode.PERMIT_NOT_EDITABLE })
        return undefined
      }
      return permit
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
