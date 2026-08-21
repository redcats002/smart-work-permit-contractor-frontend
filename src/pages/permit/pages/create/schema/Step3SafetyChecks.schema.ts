import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { validateReadings, type IReadingFailure, type TSafetyReadings } from '@/utils/PermitSafety'

/**
 * PMT-006 — step 3 gate.
 *
 * The verdict comes entirely from `validateReadings()` (PMT-001, src/utils/PermitSafety.ts): the
 * single source of truth for which readings a type requires and what counts as in range. No bound
 * is re-typed here. There is deliberately NO override — an out-of-range reading blocks Next, and
 * the backend enforces the same rule again at submit (`GAS_OUT_OF_RANGE` / `WIND_OUT_OF_RANGE`),
 * where its verdict wins.
 *
 * SO2 never appears in the result: SAFETY_RANGES marks it `blocking: false` (advisory guidance
 * only, per docs/modules/permit/context.md).
 */
const ReadingValue = z.union([z.number(), z.null()]).optional()

export const SafetyReadingShape = z.object({
  lel: ReadingValue,
  o2: ReadingValue,
  co: ReadingValue,
  so2: ReadingValue,
  wind: ReadingValue,
  height: ReadingValue
})

/** i18n key for a failure, so the same wording backs the schema message and the blocked banner. */
export function readingFailureMessage (failure: IReadingFailure): string {
  const reading = i18n.global.t(`permit.create.steps.safetyChecks.reading.${failure.reading}`)
  const suffix = failure.reason === 'MISSING' ? 'missing' : 'outOfRange'
  return i18n.global.t(`permit.create.steps.safetyChecks.failure.${suffix}`, { reading })
}

export const Step3SafetyChecksSchema = z
  .object({
    type: z.enum(EPermitType),
    outdoorWork: z.boolean().optional(),
    safetyReading: SafetyReadingShape.optional()
  })
  .superRefine((data: { type: TPermitType, outdoorWork?: boolean, safetyReading?: TSafetyReadings }, ctx: z.RefinementCtx): void => {
    const failures = validateReadings(data.type, data.safetyReading ?? {}, data.outdoorWork ?? false)
    for (const failure of failures) {
      ctx.addIssue({
        code: 'custom',
        path: ['safetyReading', failure.reading],
        message: readingFailureMessage(failure)
      })
    }
  })

export default Step3SafetyChecksSchema
