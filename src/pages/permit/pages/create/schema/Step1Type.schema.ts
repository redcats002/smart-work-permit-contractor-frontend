import { z } from 'zod'

/**
 * PLACEHOLDER — PMT-005 replaces this with a real check (`type` must be one of
 * EPermitType). `z.object({})` ignores every key it isn't told about, including
 * `type`, so it always passes against the wizard's current empty formData and
 * unblocks Next end to end while the type-picker itself doesn't exist yet.
 */
export const Step1TypeSchema = z.object({})
