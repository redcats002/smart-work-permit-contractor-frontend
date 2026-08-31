import { z } from 'zod'

/**
 * feat-023 — step gate for the facility-plan position picker.
 *
 * Deliberately permissive: whether a pin is REQUIRED depends on whether an active facility plan
 * exists, which is async external state `formData` never carries — a zod schema can't see it.
 * That gate lives in `usePlanPosition`/`useWizard.isNextBlocked` instead (the same pattern
 * `certificateState` already uses for the PPE & Workers step). This schema only shape-checks
 * `position` when it IS present, so a malformed value can never be sent.
 */
export const Step7PositionSchema = z.object({
  position: z.union([
    z.object({
      planId: z.number(),
      planX: z.number().min(0).max(100),
      planY: z.number().min(0).max(100)
    }),
    z.null()
  ]).optional()
})

export default Step7PositionSchema
