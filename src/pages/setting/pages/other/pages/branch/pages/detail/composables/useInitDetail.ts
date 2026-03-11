import { ref, type Ref } from 'vue'
import type { IBranchById } from '@/models/response/branch/BranchRes.model'

export function useInitDetail (data?: Partial<IBranchById>): Ref<IBranchById> {
  return ref<IBranchById>({
    ...data,
    id: data?.id || 0,
    name: data?.name || '',
    address: data?.address || '',
    branchTimes: data?.branchTimes || [],
    district: data?.district || '',
    province: data?.province || '',
    postCode: data?.postCode || '',
    openAt: data?.openAt || '',
    subDistrict: data?.subDistrict || '',
    taxId: data?.taxId || '',
    status: data?.status || 'INACTIVE'
  })
}
