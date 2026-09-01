import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

export interface IUseWorkerCertificateSuggestions {
  certificates: Ref<ICertificate[]>
  loading: Ref<boolean>
  fetch (): Promise<void>
  filter (query: string): ICertificate[]
  /** Splices a freshly created certificate into the local cache so it suggests immediately. */
  add (certificate: ICertificate): void
}

/**
 * wayfinder ticket 004 — suggestion source for the worker-name AutoComplete on step 4 (PPE &
 * Workers). `GET /api/v1/certificates/` has no server-side search parameter (ticket 003), so the
 * full list is fetched once and filtered client-side on every keystroke, matching `limit: 9999`
 * precedent in `useHistory.ts`'s CSV export path rather than the paginated 50-row page size the
 * certificate list screen uses.
 *
 * A failed fetch degrades to "no suggestions" — never a toast, never a blocking state. The
 * worker-name field stays legal free text regardless (../PROMPT-LOG.md, session 11: "a worker
 * stays a name string ... free text remains legal"), so a suggestion source that is temporarily
 * unavailable must not stop anyone from typing a name.
 */
export function useWorkerCertificateSuggestions (): IUseWorkerCertificateSuggestions {
  const CertificateService: ICertificateProvider = new CertificateProvider()

  const certificates = ref<ICertificate[]>([]) as Ref<ICertificate[]>
  const loading = ref(false)

  async function fetch (): Promise<void> {
    await handleLoading(
      async (): Promise<void> => {
        const response = await CertificateService.list({ page: 1, limit: 9999 })
        certificates.value = response.data
      }, { loadingUnit: loading }, (): void => {
        // Silent by design — see module doc above.
      }
    )
  }

  function filter (query: string): ICertificate[] {
    const normalized = query.trim().toLowerCase()
    // A COPY, never `certificates.value` itself: PrimeVue's AutoComplete opens its overlay from a
    // watcher on the `suggestions` prop, which only fires on a reference change. Handing back the
    // same array twice in a row would leave the panel shut.
    if (!normalized) return [...certificates.value]
    return certificates.value.filter(
      (certificate: ICertificate): boolean => certificate.workerName.toLowerCase().includes(normalized)
    )
  }

  function add (certificate: ICertificate): void {
    certificates.value = [certificate, ...certificates.value]
  }

  return {
    certificates,
    loading,
    fetch,
    filter,
    add
  }
}

export default useWorkerCertificateSuggestions
