import type { IBaseSuccessResponse } from '@/models/response/Response.model'

export type TPermitRole = 'contractor' | 'safety_officer' | 'inspector'

// Contractor business record. Owned by the safety officer — this app displays it and never
// writes it. `firmName` is the contracting firm, a descriptive field: the deployment is
// single-tenant (one domain = one company), so nothing may be scoped by it.
// See docs/main/PROMPT-LOG.md 2026-08-23.
export interface IContractorProfile {
  firmName: string | null
  taxId: string | null
  address: string | null
  contactPerson: string | null
  contractStart: string | null
  contractEnd: string | null
}

export interface IUserAccount {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phoneNumberPrefix: string | null
  phoneNumber: string | null
  phoneNumberExtend: string | null
  permitRole: TPermitRole | null
  active: boolean
  createdAt: string
  updatedAt: string
  contractorProfile: IContractorProfile | null
}

export type TGetMyProfileResponse = IBaseSuccessResponse<IUserAccount>
export type TUpdateMyProfileResponse = IBaseSuccessResponse<IUserAccount>
