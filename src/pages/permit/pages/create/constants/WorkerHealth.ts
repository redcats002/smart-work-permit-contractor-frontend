import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Pre-work health check thresholds (PMT-007, design lines 331-360 + the evaluation at design
 * line ~1955). These numbers live HERE and nowhere else in the step.
 *
 * They are deliberately NOT added to src/utils/PermitSafety.ts: SAFETY_RANGES is the atmosphere /
 * wind contract shared with the backend's own validator, and a worker's blood pressure is neither
 * — the backend stores `bloodPressure` / `alcoholReading` as free-text strings and does not
 * validate them at all. This is a client-side pre-work aid, and the design is its only source.
 */
export const WORKER_HEALTH_LIMITS = {
  /** Systolic mmHg — outside [min, max) is abnormal. */
  systolicMin: 90,
  systolicMax: 140,
  /** Diastolic mmHg. */
  diastolicMin: 60,
  diastolicMax: 90,
  /** mg% — the regulation is zero tolerance, so anything above this fails. */
  alcoholMax: 0
} as const

/** Only Confined Space registers a pre-work health check — see PMT-007 acceptance. */
export function requiresHealthCheck (type: TPermitType | undefined): boolean {
  return type === EPermitType.CONFINED
}

export type TWorkerHealthIssue = 'BLOOD_PRESSURE' | 'ALCOHOL'

/**
 * A worker row mid-edit. `workerName` / `roleOnPermit` are `minLength: 1` on the wire but are
 * empty while the user is still filling the row in, and `roleOnPermit` is widened to `string`
 * so the same helpers can be reused from the zod schema, which parses unvalidated input.
 * `IPermitWorker` is assignable to this.
 */
export interface TWorkerDraft {
  id?: number
  /** wayfinder 060 — present once Step 4 collects a Worker record (wayfinder 063). */
  workerId?: number
  workerName?: string
  roleOnPermit?: string
  bloodPressure?: string | null
  alcoholReading?: string | null
}

/**
 * Mirrors the design's own evaluation, including its asymmetry, which is intentional:
 *
 * - **Blood pressure** is judged only when it parses as `systolic/diastolic`. A blank or
 *   not-yet-entered BP is "unrecorded", not "abnormal", so it does not fail on its own.
 * - **Alcohol** fails when blank or unparseable as well as when above the limit — a breath test
 *   that was never taken is not a pass, and the regulation forbids entry above 0 mg%.
 *
 * Net effect: a freshly added Confined Space worker reads ✗ until their alcohol test is entered,
 * which is the correct default for a permit-to-work.
 */
export function workerHealthIssues (worker: TWorkerDraft): TWorkerHealthIssue[] {
  const issues: TWorkerHealthIssue[] = []

  const parts = (worker.bloodPressure ?? '').split('/').map(
    (part: string): number => Number.parseFloat(part)
  )
  if (parts.length === 2) {
    const [systolic, diastolic] = parts
    const abnormal = Number.isNaN(systolic) || Number.isNaN(diastolic)
      || systolic >= WORKER_HEALTH_LIMITS.systolicMax || systolic < WORKER_HEALTH_LIMITS.systolicMin
      || diastolic >= WORKER_HEALTH_LIMITS.diastolicMax || diastolic < WORKER_HEALTH_LIMITS.diastolicMin
    if (abnormal) issues.push('BLOOD_PRESSURE')
  }

  const alcohol = Number.parseFloat(worker.alcoholReading ?? '')
  if (Number.isNaN(alcohol) || alcohol > WORKER_HEALTH_LIMITS.alcoholMax) issues.push('ALCOHOL')

  return issues
}

export function workerHealthPassed (worker: TWorkerDraft): boolean {
  return workerHealthIssues(worker).length === 0
}

/** A row is complete when the two fields PATCH declares `minLength: 1` on are both filled. */
export function workerRowComplete (worker: TWorkerDraft): boolean {
  return Boolean(worker.workerName?.trim()) && Boolean(worker.roleOnPermit)
}

/**
 * Locale-key slug for a worker role. `EWorkerRole`'s values are the English wire strings and
 * contain spaces ("Fire Watcher"), which do not make safe i18n keys — the slug does. Copy lives
 * at `permit.create.steps.ppeWorkers.role.<slug>` (this module owns `permit.create.*` only;
 * a shared `permit.workerRole.*` namespace would have crossed into another agent's file).
 */
export function workerRoleSlug (role: string): string {
  return role.toLowerCase().replace(/\s+/g, '-')
}
