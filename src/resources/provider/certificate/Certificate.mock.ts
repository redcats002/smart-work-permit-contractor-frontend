import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

/**
 * ⚠ STUB DATA — only imported by Certificate.provider.ts while `USE_STUB_DATA` is true
 * there. Backend `/certificates` endpoints (docs/modules/certificate/context.md) are not
 * deployed/reachable yet. Delete this file + the `USE_STUB_DATA` branches in
 * Certificate.provider.ts once the real API is reachable — nothing else imports from here.
 *
 * Source: transcribed from docs/main/SmartWorkPermit-v3.dc.html `certCards` (~line 2254),
 * reshaped to the ICertificate model. Deliberately covers all three validity states
 * (valid / expiring-soon / expired) so the list page is reviewable offline.
 */
export const MOCK_CERTIFICATES: ICertificate[] = [
  {
    id: 'CERT-001',
    workerName: 'Somchai Pansiri',
    role: 'CS Entrant / Attendant',
    certType: 'Confined Space Entry',
    issuedDate: '2024-03-15',
    expiryDate: '2027-03-14',
    fileRef: 'cert_somchai_2024.pdf'
  },
  {
    id: 'CERT-002',
    workerName: 'Nattapong Rakthai',
    role: 'CS Entrant',
    certType: 'Confined Space Entry',
    issuedDate: '2024-01-10',
    expiryDate: '2027-01-09',
    fileRef: 'cert_nattapong_2024.pdf'
  },
  {
    id: 'CERT-003',
    workerName: 'Anan Kittisak',
    role: 'Supervisor / Foreman',
    certType: 'Hot Work Supervisor',
    issuedDate: '2023-06-01',
    expiryDate: '2026-05-31',
    fileRef: 'cert_anan_2023.pdf'
  },
  {
    id: 'CERT-004',
    workerName: 'Krit Saetang',
    role: 'Gas Tester / Attendant',
    certType: 'Confined Space Attendant',
    issuedDate: '2025-02-20',
    expiryDate: '2026-08-15',
    fileRef: 'cert_krit_2025.pdf'
  },
  {
    id: 'CERT-005',
    workerName: 'Wichai Thongchai',
    role: 'Heights Worker / Inspector',
    certType: 'Working at Heights',
    issuedDate: '2024-09-01',
    expiryDate: '2027-08-31',
    fileRef: 'cert_wichai_2024.pdf'
  }
]

/** Applies the same pagination a real backend would apply server-side. */
export function queryMockCertificates (page: number = 1, limit: number = 50): { items: ICertificate[], count: number } {
  const start = (page - 1) * limit
  const items = MOCK_CERTIFICATES.slice(start, start + limit)
  return { items, count: MOCK_CERTIFICATES.length }
}

/** Appends a newly-created stub certificate so the list reflects it without a real backend. */
export function addMockCertificate (payload: Omit<ICertificate, 'id'>): ICertificate {
  const created: ICertificate = { id: `CERT-STUB-${Date.now()}`, ...payload }
  MOCK_CERTIFICATES.unshift(created)
  return created
}

/** Case-insensitive exact match on `workerName`, mirroring GET /certificates/worker/:name. */
export function findMockCertificatesByWorker (name: string): ICertificate[] {
  const normalized = name.trim().toLowerCase()
  return MOCK_CERTIFICATES.filter((cert: ICertificate): boolean => cert.workerName.toLowerCase() === normalized)
}
