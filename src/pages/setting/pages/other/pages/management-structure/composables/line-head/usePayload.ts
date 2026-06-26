import type { ICreateManagementStructureLineHeadPayload, IUpdateManagementStructureLineHeadPayload } from '@/models/request/management-structure-line-head/ManagementStructureLineHeadReq.model'
import type { ManagementStructureLineHeadFormValues } from '../../schema/management-structure-line-head.schema'

export function useCreatePayload (form: ManagementStructureLineHeadFormValues): ICreateManagementStructureLineHeadPayload {
  return {
    ...form,
    zoneManagerId: form.zoneManagerId || undefined
  }
}
export function useUpdatePayload (form: ManagementStructureLineHeadFormValues): IUpdateManagementStructureLineHeadPayload {
  return {
    ...form,
    zoneManagerId: form.zoneManagerId || undefined
  }
}
