import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import type { WarehouseLocationFormValues, WarehouseOptionFormValues } from '../schema/warehouse.schema'

export function useGenerateLocationTable (
  warehousePrefix: string,
  options: WarehouseOptionFormValues[],
  existingLocations: WarehouseLocationFormValues[] = []
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
  const existingByName = new Map<string, WarehouseLocationFormValues>(
    existingLocations
      .filter((loc: WarehouseLocationFormValues): boolean => !!loc.name)
      .map((loc: WarehouseLocationFormValues): [string, WarehouseLocationFormValues] => [loc.name!, loc])
  )

  return combinations.map((name: string): WarehouseLocationFormValues => {
    const fullName = cleanWarehousePrefix ? `${cleanWarehousePrefix}-${name}` : name
    const existing = existingByName.get(fullName)

    if (existing) {
      return { ...existing }
    }

    return {
      name: fullName,
      status: LocationStatusEnum.ACTIVE
    }
  })
}
