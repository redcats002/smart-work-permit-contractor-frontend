import { describe, expect, it } from 'vitest'
import { ECertType } from '@/enums/modules/certificate/CertType.enum'
import { EWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'
import { buildCertTypeOptions, type ICertTypeOption } from '@/utils/CertType'

/**
 * Wayfinder 086 — the two constraints 050's data audit demanded tests for:
 *
 *  - a worker whose role is outside the vocabulary must stay certifiable (the Select falls back
 *    to the full list rather than an empty one)
 *  - an existing certificate holding a certType the Select does not offer must survive, never
 *    render blank, and never be silently dropped
 */
describe('buildCertTypeOptions — filters by a recognised role', () => {
  it('narrows to the role\'s allowed cert types', () => {
    const { options, roleRecognized } = buildCertTypeOptions(EWorkerRole.ENTRANT, undefined)

    expect(roleRecognized).toBe(true)
    expect(options.map((option: ICertTypeOption): string => option.value)).toEqual([ECertType.CONFINED_SPACE_ENTRY])
    expect(options.every((option: ICertTypeOption): boolean => !option.legacy)).toBe(true)
  })

  it('a Supervisor is allowed all three gating types', () => {
    const { options } = buildCertTypeOptions(EWorkerRole.SUPERVISOR, undefined)

    expect(options.map((option: ICertTypeOption): string => option.value)).toEqual([
      ECertType.HOT_WORK,
      ECertType.CONFINED_SPACE_ENTRY,
      ECertType.WORKING_AT_HEIGHTS
    ])
  })
})

describe('buildCertTypeOptions — a worker whose role is outside the vocabulary stays certifiable', () => {
  it('falls back to the full ECertType list for a real but uncatalogued role (050\'s data audit: "Welder")', () => {
    const { options, roleRecognized } = buildCertTypeOptions('Welder', undefined)

    expect(roleRecognized).toBe(false)
    expect(options.map((option: ICertTypeOption): string => option.value)).toEqual(Object.values(ECertType))
    expect(options.every((option: ICertTypeOption): boolean => !option.legacy)).toBe(true)
  })

  it('falls back to the full list for Thai free-text role data ("ช่างซ่อมบำรุง")', () => {
    const { options, roleRecognized } = buildCertTypeOptions('ช่างซ่อมบำรุง', undefined)

    expect(roleRecognized).toBe(false)
    expect(options.length).toBe(Object.values(ECertType).length)
  })

  it('falls back to the full list when no worker is selected yet (role undefined)', () => {
    const { options, roleRecognized } = buildCertTypeOptions(undefined, undefined)

    expect(roleRecognized).toBe(false)
    expect(options.length).toBe(Object.values(ECertType).length)
  })
})

describe('buildCertTypeOptions — an existing certificate\'s stored value always survives', () => {
  it('a genuinely unrecognised legacy certType is appended, flagged legacy, never blank', () => {
    const { options } = buildCertTypeOptions(EWorkerRole.ENTRANT, 'hot-work')

    const legacy = options.find((option: ICertTypeOption): boolean => option.value === 'hot-work')
    expect(legacy).toBeDefined()
    expect(legacy?.legacy).toBe(true)
    // Still offers the role's own fitting type alongside it.
    expect(options.some((option: ICertTypeOption): boolean => option.value === ECertType.CONFINED_SPACE_ENTRY)).toBe(true)
  })

  it('a real ECertType value merely excluded by the role filter is appended, NOT flagged legacy', () => {
    // An Entrant's card is normally Confined Space Entry; Gas Testing is a real vocabulary value
    // but is not in ENTRANT's allowed set. It must still be selectable, just not lost.
    const { options } = buildCertTypeOptions(EWorkerRole.ENTRANT, ECertType.GAS_TESTING)

    const gasTesting = options.find((option: ICertTypeOption): boolean => option.value === ECertType.GAS_TESTING)
    expect(gasTesting).toBeDefined()
    expect(gasTesting?.legacy).toBe(false)
  })

  it('does not duplicate the current value when it is already in the filtered set', () => {
    const { options } = buildCertTypeOptions(EWorkerRole.ENTRANT, ECertType.CONFINED_SPACE_ENTRY)

    expect(options.filter((option: ICertTypeOption): boolean => option.value === ECertType.CONFINED_SPACE_ENTRY).length).toBe(1)
  })

  it('an empty/undefined current value adds nothing extra', () => {
    const { options } = buildCertTypeOptions(EWorkerRole.ENTRANT, undefined)

    expect(options.length).toBe(1)
  })
})
