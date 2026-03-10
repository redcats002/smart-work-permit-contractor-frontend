import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import { describe, expect, it } from 'vitest'
import { useGenerateLocationTable } from './useGenerateLocationTable'

describe('useGenerateLocationTable', (): void => {
  it('generates WH-A1 and WH-A2 for one option with prefix', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: false, prefix: 'A', maxLimit: 2 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2', status: LocationStatusEnum.INACTIVE }
    ])
  })

  it('generates cartesian combinations for two levels', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: false, prefix: 'A', maxLimit: 2 },
      { isRequirePrefix: false, prefix: 'B', maxLimit: 2 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1-B1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B2', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B2', status: LocationStatusEnum.INACTIVE }
    ])
  })

  it('uses plain index segment when option prefix is empty', (): void => {
    const result = useGenerateLocationTable('WH', [
      { isRequirePrefix: false, prefix: 'A', maxLimit: 2 },
      { isRequirePrefix: false, prefix: 'B', maxLimit: 2 },
      { isRequirePrefix: false, prefix: '', maxLimit: 3 }
    ])

    expect(result).toEqual([
      { name: 'WH-A1-B1-1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B1-2', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B1-3', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B2-1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B2-2', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A1-B2-3', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B1-1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B1-2', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B1-3', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B2-1', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B2-2', status: LocationStatusEnum.INACTIVE },
      { name: 'WH-A2-B2-3', status: LocationStatusEnum.INACTIVE }
    ])
  })

  it('returns empty result when no options are provided', (): void => {
    const result = useGenerateLocationTable('WH', [])
    expect(result).toEqual([])
  })
})
