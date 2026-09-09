import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import { certificateStatus } from '@/utils/CertificateStatus'

/**
 * The stub fixtures are gone (API-007). They also caused a red baseline: the fixture dates drifted
 * out of the 30-day window and the "covers all three validity states" assertion started failing on
 * a date, with nothing having changed in the code.
 */
type TAxiosMethod = (...args: unknown[]) => Promise<unknown>

function transport (service: ICertificateProvider): Record<string, TAxiosMethod> {
  return (service as unknown as { axiosInstance: Record<string, TAxiosMethod> }).axiosInstance
}

describe('CertificateProvider — wire contract (API-007)', () => {
  let service: ICertificateProvider

  beforeEach(() => {
    vi.restoreAllMocks()
    service = new CertificateProvider()
  })

  it('list GETs /api/v1/certificates with the query as params', async () => {
    const get = vi.spyOn(transport(service), 'get').mockResolvedValue({ message: 'success', data: [], count: 0 })

    await service.list({ page: 1, limit: 50 })

    expect(get).toHaveBeenCalledWith('/api/v1/certificates', { params: { page: 1, limit: 50 } })
  })

  it('create POSTs the certificate payload', async () => {
    const post = vi.spyOn(transport(service), 'post').mockResolvedValue({ message: 'success', data: {} })
    const payload = {
      workerId: 42,
      certType: 'Hot Work Safety',
      issuedDate: '2026-01-10',
      expiryDate: '2027-01-10'
    }

    await service.create(payload)

    expect(post).toHaveBeenCalledWith('/api/v1/certificates', payload, undefined)
  })

  it('byWorker keys on the worker id and reads one certificate or null', async () => {
    const get = vi.spyOn(transport(service), 'get').mockResolvedValue({ message: 'success', data: null })

    // wayfinder 060 — was `/worker/{name}` with URL-encoding, which is why this test used to be
    // about encoding a space. The route is keyed on the id now, and it is contractor-scoped
    // server-side; the name-keyed version was an unscoped cross-tenant read.
    const response = await service.byWorker(42)

    expect(get).toHaveBeenCalledWith('/api/v1/certificates/worker/42', { params: undefined })
    expect(response.data).toBeNull()
  })
})

describe('certificateStatus — the server owns expiry (API-007)', () => {
  const now = '2026-08-17T03:00:00.000Z'

  it('honours the backend expired flag even when the date reads otherwise', () => {
    expect(certificateStatus('2027-01-10', now, true)).toBe(ECertificateStatus.EXPIRED)
  })

  it('only decides the advisory expiring-soon window when the server says not expired', () => {
    expect(certificateStatus('2026-08-30', now, false)).toBe(ECertificateStatus.EXPIRING_SOON)
    expect(certificateStatus('2027-08-30', now, false)).toBe(ECertificateStatus.VALID)
  })

  it('still classifies from the date alone when no flag is supplied', () => {
    expect(certificateStatus('2026-08-01', now)).toBe(ECertificateStatus.EXPIRED)
  })
})
