import { afterEach, describe, expect, it, vi } from 'vitest'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import { useWorkerCertificateSuggestions } from '@/pages/permit/pages/create/composables/useWorkerCertificateSuggestions'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

/**
 * wayfinder ticket 004 — the worker-name AutoComplete's suggestion source for step 4.
 * `GET /api/v1/certificates/` has no server-side search parameter (ticket 003), so this
 * composable fetches the full list once and filters client-side.
 */
function certificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 1,
    workerName: 'Somchai',
    role: 'Operator',
    certType: 'hot-work',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    expired: false,
    ...overrides
  }
}

describe('useWorkerCertificateSuggestions', () => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('fetches the full certificate list with no search parameter', async () => {
    const listSpy = vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [certificate()], count: 1, totalPage: 1
    } as never)

    const suggestions = useWorkerCertificateSuggestions()
    await suggestions.fetch()

    expect(listSpy).toHaveBeenCalledWith({ page: 1, limit: 9999 })
    expect(suggestions.filter('')).toEqual([certificate()])
  })

  it('filters case-insensitively by workerName substring', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok',
      data: [certificate({ workerName: 'Somchai' }), certificate({ id: 2, workerName: 'Malee' })],
      count: 2,
      totalPage: 1
    } as never)

    const suggestions = useWorkerCertificateSuggestions()
    await suggestions.fetch()

    expect(suggestions.filter('som').map((c: ICertificate): string => c.workerName)).toEqual(['Somchai'])
    expect(suggestions.filter('SOM').map((c: ICertificate): string => c.workerName)).toEqual(['Somchai'])
    expect(suggestions.filter('zzz')).toEqual([])
  })

  it('splices a freshly created certificate into the cache without a refetch', async () => {
    const listSpy = vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [], count: 0, totalPage: 1
    } as never)

    const suggestions = useWorkerCertificateSuggestions()
    await suggestions.fetch()
    expect(suggestions.filter('')).toEqual([])

    suggestions.add(certificate({ workerName: 'Newly Created' }))

    expect(suggestions.filter('newly').map((c: ICertificate): string => c.workerName)).toEqual(['Newly Created'])
    expect(listSpy).toHaveBeenCalledTimes(1)
  })

  it('degrades to no suggestions on a failed fetch, never throwing', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockRejectedValue(new Error('network down'))

    const suggestions = useWorkerCertificateSuggestions()
    await expect(suggestions.fetch()).resolves.toBeUndefined()
    expect(suggestions.filter('')).toEqual([])
  })
})
