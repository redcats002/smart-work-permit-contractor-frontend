import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'

/**
 * One immutable facility-plan version (docs/main/PROMPT-LOG.md, session 11, "the facility plan is
 * a JPEG/PNG raster"; feat-023). Versions are retained forever and never mutated — only one is
 * `active` at a time. `fileRef` is a storage path, not a URL: resolve it through
 * `UploadService.getFileUrl()`, same as every other stored file in this app.
 *
 * The contractor app is READ-ONLY against this resource — upload/create/activate are Safety
 * Officer actions in the sibling app. Only `GET /facility-plans/active` and
 * `GET /facility-plans/:id` are wired here, both open to every role.
 */
export interface IFacilityPlan {
  id: number
  fileRef: string
  uploadedById: string
  uploadedBy: IPermitAuthor | null
  createdAt: string
  activatedAt: string | null
  active: boolean
}
