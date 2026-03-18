import type { Ref } from 'vue'
import type { IWarehouseLocation } from '@/models/modules/warehouse/WarehouseLocation.model'
import type { IWarehouseOption } from '@/models/modules/warehouse/WarehouseOption.model'
import type { IWarehouseById } from '@/models/response/warehouse/WarehouseRes.model'
import type { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import type { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import type { WarehouseFormValues, WarehouseLocationFormValues, WarehouseOptionFormValues } from '../../create/schema/warehouse.schema'

export function useInitForm (form: Ref<WarehouseFormValues>, data: IWarehouseById): void {
  form.value = {
    ...data,
    name: data?.name || '',
    locations: (data?.locations || [])?.map((location: IWarehouseLocation): WarehouseLocationFormValues => ({
      id: location.id || undefined,
      name: location.name,
      optionIds: location?.optionIds || undefined,
      status: location.status as LocationStatusEnum
    })),
    options: (data?.options || [])?.map((option: IWarehouseOption): WarehouseOptionFormValues => ({
      ...option,
      id: option.id || undefined
    })),
    prefix: data?.prefix || '',
    status: data?.status as WarehouseStatusEnum
  }
}
