import type { IUpdateWarehousePayload } from '@/models/request/warehouse/WarehouseReq.model'
import type { WarehouseFormValues, WarehouseLocationFormValues, WarehouseOptionFormValues } from '../../create/schema/warehouse.schema'

export function usePayload (form: WarehouseFormValues): IUpdateWarehousePayload {
  return {
    ...form,
    locations: form.locations.map((location: WarehouseLocationFormValues): WarehouseLocationFormValues => ({
      id: location.id,
      optionIds: location.optionIds,
      name: location.name,
      status: location.status
    })),
    options: form.options.map((option: WarehouseOptionFormValues): WarehouseOptionFormValues => ({
      id: option.id,
      isRequirePrefix: option.isRequirePrefix,
      prefix: option.prefix,
      maxLimit: option.maxLimit
    }))
  }
}
