import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import { describe, expect, it } from 'vitest'
import { useGenerateLocationTable } from './useGenerateLocationTable'

describe('useGenerateLocationTable', (): void => {
  it('generates WH-A1 and WH-A2 for one option with prefix', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('generates cartesian combinations for two levels', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 },
      { isRequirePrefix: true, prefix: 'B', maxLimit: 2 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1-B1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B2', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('edge case test with invalid isRequiredPrefix payload', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 },
      { isRequirePrefix: false, prefix: 'B', maxLimit: 2 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-2', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('uses plain index segment when option prefix is empty', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 },
      { isRequirePrefix: true, prefix: 'B', maxLimit: 2 },
      { isRequirePrefix: false, prefix: '', maxLimit: 3 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1-B1-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B1-2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B1-3', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B2-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B2-2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A1-B2-3', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B1-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B1-2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B1-3', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B2-1', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B2-2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A2-B2-3', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('returns empty result when no options are provided', (): void => {
    const result = useGenerateLocationTable('WH', [])
    expect(result).toEqual([])
  })

  it('preserves existing location id when name matches', (): void => {
    const existing = [
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 },
      { name: 'WH-A2', status: LocationStatusEnum.ACTIVE, id: 20 }
    ]
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 }
    ], existing)

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 },
      { name: 'WH-A2', status: LocationStatusEnum.ACTIVE, id: 20 }
    ])
  })

  it('merges existing and new locations by name', (): void => {
    const existing = [
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 }
    ]
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 3 }
    ], existing)

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 },
      { name: 'WH-A2', status: LocationStatusEnum.ACTIVE },
      { name: 'WH-A3', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('drops existing locations not in generated set', (): void => {
    const existing = [
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 },
      { name: 'WH-A9', status: LocationStatusEnum.ACTIVE, id: 99 }
    ]
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 2 }
    ], existing)

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 10 },
      { name: 'WH-A2', status: LocationStatusEnum.ACTIVE }
    ])
  })

  it('preserves optionIds from existing locations', (): void => {
    const existing = [
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 5, optionIds: '1,2' }
    ]
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: true, prefix: 'A', maxLimit: 1 }
    ], existing)

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.ACTIVE, id: 5, optionIds: '1,2' }
    ])
  })
})
