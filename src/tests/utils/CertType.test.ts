import { describe, expect, it } from 'vitest'
import { ECertType } from '@/enums/modules/certificate/CertType.enum'
import { buildCertTypeOptions, type ICertTypeOption } from '@/utils/CertType'

const values = (options: ICertTypeOption[]): string[] => options.map((option: ICertTypeOption): string => option.value)

/**
 * Wayfinder 086, amended by 103: no role filter remains. What 050's data audit demanded still
 * holds — a stored certType the Select does not offer survives, never blank, never dropped.
 */
describe('buildCertTypeOptions', () => {
  it('offers the full ECertType vocabulary, none legacy', () => {
    const options = buildCertTypeOptions(undefined)
    expect(values(options)).toEqual(Object.values(ECertType))
    expect(options.every((option: ICertTypeOption): boolean => !option.legacy)).toBe(true)
  })

  it('appends a genuinely unrecognised stored value, flagged legacy', () => {
    const legacy = buildCertTypeOptions('Gas Testing').find((option: ICertTypeOption): boolean => option.value === 'Gas Testing')
    expect(legacy?.legacy).toBe(true)
  })

  it('does not duplicate a stored value already in the vocabulary', () => {
    const options = buildCertTypeOptions(ECertType.HOT_WORK)
    expect(values(options).filter((value: string): boolean => value === ECertType.HOT_WORK)).toHaveLength(1)
  })
})
