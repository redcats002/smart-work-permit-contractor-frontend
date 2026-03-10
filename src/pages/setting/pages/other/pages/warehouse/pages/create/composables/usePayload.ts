import type { ICreateWarehousePayload } from '@/models/request/warehouse/WarehouseReq.model'
import type { WarehouseFormValues, WarehouseLocationFormValues, WarehouseOptionFormValues } from '../schema/warehouse.schema'

export function usePayload (form: WarehouseFormValues): ICreateWarehousePayload {
  return {
    ...form,
    locations: form.locations.map((location: WarehouseLocationFormValues): WarehouseLocationFormValues => ({
      name: location.name,
      status: location.status
    })),
    options: form.options.map((option: WarehouseOptionFormValues): WarehouseOptionFormValues => ({
      isRequirePrefix: option.isRequirePrefix,
      prefix: option.prefix,
      maxLimit: option.maxLimit
    }))
  }
}
