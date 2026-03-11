import type { ICreateBranchPayload } from '@/models/request/branch/BranchReq.model'
import type { BranchFormValues } from '../schema/branch.schema'

export function usePayload (form: BranchFormValues): ICreateBranchPayload {
  return {
    ...form
  }
}
