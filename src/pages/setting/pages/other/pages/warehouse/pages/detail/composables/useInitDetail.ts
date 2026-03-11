import { ref, type Ref } from 'vue'
import type { IWarehouseById } from '@/models/response/warehouse/WarehouseRes.model'

export function useInitDetail (data?: Partial<IWarehouseById>): Ref<IWarehouseById> {
  return ref<IWarehouseById>({
    ...data,
    id: data?.id || 0,
    name: data?.name || '',
    locations: data?.locations || [],
    options: data?.options || [],
    prefix: data?.prefix || '',
    status: data?.status || 'ACTIVE'
  })
}
