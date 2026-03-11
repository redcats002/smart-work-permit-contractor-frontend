import type { IUpdateBranchPayload } from '@/models/request/branch/BranchReq.model'
import type { BranchFormValues } from '../../create/schema/branch.schema'

export function usePayload (form: BranchFormValues): IUpdateBranchPayload {
  return {
    ...form
  }
}
