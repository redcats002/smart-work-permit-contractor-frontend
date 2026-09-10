import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'
import {
  requiresHealthCheck, workerHealthPassed, workerRowComplete, type TWorkerDraft
} from '../constants/WorkerHealth'

/**
 * PMT-007 — step 4 gate.
 *
 * Blocks Next on exactly two things:
 *  1. an incomplete worker row — `workerName` and `roleOnPermit` are both `minLength: 1` on the
 *     PATCH body, so a half-filled row would 400;
 *  2. a Confined Space worker who fails the pre-work health check (alcohol above 0 mg% or an
 *     abnormal blood pressure) — the Thai ministerial regulation forbids entry.
 *
 * It deliberately does NOT require a minimum worker count and does NOT require every photo slot
 * to be filled: neither is in the backend contract, and inventing a client-only rule that stops a
 * user submitting something the server would accept is worse than letting the server answer.
 * (The one sanctioned unconfirmed client rule in this module is PMT-008's JSA minimum.)
 */
const WorkerShape = z.object({
  id: z.number().optional(),
  /** wayfinder 063 — `PermitWorker.workerId` is `NOT NULL`; `workerRowComplete` enforces it. */
  workerId: z.number().optional(),
  workerName: z.string().optional(),
  roleOnPermit: z.string().optional(),
  bloodPressure: z.union([z.string(), z.null()]).optional(),
  alcoholReading: z.union([z.string(), z.null()]).optional()
})

interface IStep4Slice {
  type: TPermitType
  workers?: TWorkerDraft[]
}

export const Step4PpeWorkersSchema = z
  .object({
    type: z.enum(EPermitType),
    workers: z.array(WorkerShape).optional()
  })
  .superRefine((data: IStep4Slice, ctx: z.RefinementCtx): void => {
    const workers = data.workers ?? []

    workers.forEach((worker: TWorkerDraft, index: number): void => {
      if (!workerRowComplete(worker)) {
        ctx.addIssue({
          code: 'custom',
          path: ['workers', index],
          message: i18n.global.t('permit.create.steps.ppeWorkers.validation.incompleteRow')
        })
        return
      }
      if (requiresHealthCheck(data.type) && !workerHealthPassed(worker)) {
        ctx.addIssue({
          code: 'custom',
          path: ['workers', index],
          message: i18n.global.t('permit.create.steps.ppeWorkers.validation.healthFailed', {
            worker: worker.workerName
          })
        })
      }
    })
  })

export default Step4PpeWorkersSchema
