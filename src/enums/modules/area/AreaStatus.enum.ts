/**
 * wayfinder ticket 037 / 034 — an Area's lifecycle mirrors the permit and facility-plan
 * approve/reject flows already in this app. A contractor's `POST /v1/areas` always creates
 * PENDING; only `APPROVED` may ever be referenced by a permit (`AREA_NOT_APPROVED` otherwise).
 */
export enum EAreaStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type TAreaStatus = keyof typeof EAreaStatus

export default EAreaStatus
