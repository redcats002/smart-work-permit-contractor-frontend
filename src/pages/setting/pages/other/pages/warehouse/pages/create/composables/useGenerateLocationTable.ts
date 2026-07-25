import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import type { WarehouseLocationFormValues, WarehouseOptionFormValues } from '../schema/warehouse.schema'

export function useGenerateLocationTable (
  warehousePrefix: string,
  options: WarehouseOptionFormValues[]
): WarehouseLocationFormValues[] {
  if (!options.length) return []

  let combinations: string[] = ['']

  for (const option of options) {
    const maxLimit = Number.isFinite(option.maxLimit) ? Math.floor(option.maxLimit) : 0
    if (maxLimit < 1) return []

    const cleanPrefix = option.isRequirePrefix ? option?.prefix?.trim() : ''
    const nextCombinations: string[] = []

    for (const base of combinations) {
      for (let i = 1; i <= maxLimit; i++) {
        const padLength = String(maxLimit).length
        const segment = cleanPrefix
          ? `${cleanPrefix}${String(i).padStart(padLength, '0')}`
          : `${String(i).padStart(padLength, '0')}`
        nextCombinations.push(base ? `${base}-${segment}` : segment)
      }
    }

    combinations = nextCombinations
  }

  const cleanWarehousePrefix = warehousePrefix.trim()

  return combinations.map((name: string): WarehouseLocationFormValues => ({
    name: cleanWarehousePrefix ? `${cleanWarehousePrefix}-${name}` : name,
    status: LocationStatusEnum.ACTIVE
  }))
}
