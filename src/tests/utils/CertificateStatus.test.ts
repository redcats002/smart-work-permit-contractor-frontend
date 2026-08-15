import { describe, expect, it } from 'vitest'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import { CERTIFICATE_EXPIRING_SOON_DAYS, certificateStatus } from '@/utils/CertificateStatus'

/** Fixed "now" so every case below is relative to a known Bangkok calendar date. */
const NOW_BANGKOK_NOON = '2026-08-14T05:00:00Z' // 2026-08-14 12:00 in Asia/Bangkok (UTC+7)

describe('CERTIFICATE_EXPIRING_SOON_DAYS', () => {
  it('defaults to 30 days (product decision defaulted, not confirmed)', () => {
    expect(CERTIFICATE_EXPIRING_SOON_DAYS).toBe(30)
  })
})

describe('certificateStatus — boundaries around "today"', () => {
  it('EXPIRED — expiry was yesterday', () => {
    expect(certificateStatus('2026-08-13', NOW_BANGKOK_NOON)).toBe(ECertificateStatus.EXPIRED)
  })

  it('EXPIRING_SOON — expiry is today (0 days left, not yet in the past)', () => {
    expect(certificateStatus('2026-08-14', NOW_BANGKOK_NOON)).toBe(ECertificateStatus.EXPIRING_SOON)
  })
})

describe('certificateStatus — boundaries around the expiring-soon threshold', () => {
  it(`EXPIRING_SOON — expiry is ${CERTIFICATE_EXPIRING_SOON_DAYS - 1} days out (threshold - 1)`, () => {
    expect(certificateStatus('2026-09-12', NOW_BANGKOK_NOON)).toBe(ECertificateStatus.EXPIRING_SOON)
  })

  it(`EXPIRING_SOON — expiry is exactly ${CERTIFICATE_EXPIRING_SOON_DAYS} days out (threshold, inclusive)`, () => {
    expect(certificateStatus('2026-09-13', NOW_BANGKOK_NOON)).toBe(ECertificateStatus.EXPIRING_SOON)
  })

  it(`VALID — expiry is ${CERTIFICATE_EXPIRING_SOON_DAYS + 1} days out (threshold + 1)`, () => {
    expect(certificateStatus('2026-09-14', NOW_BANGKOK_NOON)).toBe(ECertificateStatus.VALID)
  })
})

describe('certificateStatus — timezone correctness (Asia/Bangkok, not UTC/local)', () => {
  it('treats a cert expiring "today" as already EXPIRED once it is tomorrow in Bangkok, '
    + 'even though the instant is still "today" in UTC', () => {
    // 2026-08-13 23:30 UTC == 2026-08-14 06:30 in Asia/Bangkok (UTC+7) — the Bangkok
    // calendar day has already rolled over to the 14th while UTC is still on the 13th.
    const lateNightUtc = '2026-08-13T23:30:00Z'
    // A naive `new Date()` (system/UTC) comparison would call "today" the 13th and see
    // this cert as expiring today (not yet past) — the off-by-one bug this test guards.
    expect(certificateStatus('2026-08-13', lateNightUtc)).toBe(ECertificateStatus.EXPIRED)
  })

  it('does not roll over early: an instant still before Bangkok midnight keeps the same-day cert current', () => {
    // 2026-08-13 15:00 UTC == 2026-08-13 22:00 in Asia/Bangkok — still the 13th.
    const stillSameDayInBangkok = '2026-08-13T15:00:00Z'
    expect(certificateStatus('2026-08-13', stillSameDayInBangkok)).toBe(ECertificateStatus.EXPIRING_SOON)
  })
})
