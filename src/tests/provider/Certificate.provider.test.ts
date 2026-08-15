import { describe, expect, it } from 'vitest'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import { certificateStatus } from '@/utils/CertificateStatus'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

/**
 * Exercises the stub branch of Certificate.provider.ts (USE_STUB_DATA = true — see the
 * file header). Once the real backend is wired up and the flag flips to false, these
 * tests document the contract the live endpoint must keep satisfying.
 */
describe('CertificateProvider (stub mode)', () => {
  const CertificateService: ICertificateProvider = new CertificateProvider()

  it('list() returns the stub fixtures with pagination metadata', async () => {
    const response = await CertificateService.list({ page: 1, limit: 50 })
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.count).toBe(response.data.length)
    expect(response.page).toBe(1)
  })

  it('the stub fixtures cover all three validity states, so the list page is reviewable offline', async () => {
    const response = await CertificateService.list({ page: 1, limit: 50 })
    const now = new Date()
    const statuses = new Set(response.data.map((cert: ICertificate): ECertificateStatus => certificateStatus(cert.expiryDate, now)))
    expect(statuses.has(ECertificateStatus.VALID)).toBe(true)
    expect(statuses.has(ECertificateStatus.EXPIRING_SOON)).toBe(true)
    expect(statuses.has(ECertificateStatus.EXPIRED)).toBe(true)
  })

  it('create() appends the new certificate so a subsequent list() includes it', async () => {
    const before = await CertificateService.list({ page: 1, limit: 50 })
    const created = await CertificateService.create({
      workerName: 'Test Worker',
      role: 'Test Role',
      certType: 'Test Cert',
      issuedDate: '2026-01-01',
      expiryDate: '2027-01-01'
    })
    expect(created.data.workerName).toBe('Test Worker')

    const after = await CertificateService.list({ page: 1, limit: 50 })
    expect(after.data.length).toBe(before.data.length + 1)
    expect(after.data.some((cert: ICertificate): boolean => cert.id === created.data.id)).toBe(true)
  })

  it('byWorker() matches on workerName, case-insensitively', async () => {
    const list = await CertificateService.list({ page: 1, limit: 1 })
    const workerName = list.data[0].workerName

    const response = await CertificateService.byWorker(workerName.toUpperCase())
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data.every((cert: ICertificate): boolean => cert.workerName === workerName)).toBe(true)
  })

  it('byWorker() returns an empty array for an unknown worker', async () => {
    const response = await CertificateService.byWorker('Nobody Registered Here')
    expect(response.data).toEqual([])
  })
})
