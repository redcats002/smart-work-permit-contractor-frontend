import type { ICreateManagementPositionPayload, IUpdateManagementPositionPayload } from '@/models/request/management-position/ManagementPositionReq.model'
import type { ManagementStructureLineHeadFormValues } from '../../schema/management-structure-line-head.schema'

export function useCreatePayload (form: ManagementStructureLineHeadFormValues & { managementPosition?: string }): ICreateManagementPositionPayload {
  return {
    ...form,
    parentId: form.parentId || undefined
  } as ICreateManagementPositionPayload
}
export function useUpdatePayload (form: ManagementStructureLineHeadFormValues & { managementPosition?: string }): IUpdateManagementPositionPayload {
  return {
    ...form,
    parentId: form.parentId || undefined
  } as IUpdateManagementPositionPayload
}
