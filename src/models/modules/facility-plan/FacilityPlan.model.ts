import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'

/**
 * A named facility plan (wayfinder 104). Plans are a **flat set of named places** ("Floor 1",
 * "Tank Farm") — not a version chain: there is no group, no `areaId` scoping, and no
 * "active-per-group" fallback to reason about any more. A new scan of the site is a NEW plan; the
 * old one is `deactivate`d, never deleted, never overwritten in place — `fileRef` never changes
 * after creation, so a `Pin` placed on a plan always resolves the exact image it was placed
 * against.
 *
 * The contractor app is READ-ONLY against this resource — upload/create/activate/deactivate are
 * Safety Officer actions in the sibling app. Only `GET /facility-plans/` (paginated, optionally
 * `?active=`) and `GET /facility-plans/:id` are wired here, both open to every role.
 */
export interface IFacilityPlan {
  id: number
  name: string
  fileRef: string
  uploadedById: string
  uploadedBy: IPermitAuthor | null
  createdAt: string
  activatedAt: string | null
  deactivatedAt: string | null
  active: boolean
}
