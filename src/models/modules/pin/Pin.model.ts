import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'

/**
 * A named position on a `FacilityPlan`, placed by safety (wayfinder 104). `x`/`y` are 0-100,
 * PERCENTAGES of the plan frame — same convention `IPermitPosition` used, just flat here instead
 * of nested, because that is what the wire actually returns.
 *
 * Ruling 8 (2026-09-11 grilling): **names editable, positions frozen, deactivate never delete.**
 * A position is a claim about where work happened; a name is a label. Moving a pin means creating
 * a new one, so `x`/`y` never change on an existing row once safety places it.
 *
 * The contractor app is READ-ONLY against this resource — place/rename/deactivate are Safety
 * Officer actions in the sibling app, same posture `IFacilityPlanProvider` already documents for
 * `facility-plans`.
 */
export interface IPin {
  id: number
  planId: number
  name: string
  x: number
  y: number
  active: boolean
  deactivatedAt: string | null
  createdById: string
  createdBy: IPermitAuthor | null
  createdAt: string
  updatedAt: string
}
