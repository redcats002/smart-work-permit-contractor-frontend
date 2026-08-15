import { z } from 'zod'

/**
 * PLACEHOLDER — PMT-009 replaces this with a final cross-step check (every
 * prior step's schema still passes, certificates valid) before Submit enables.
 * See Step1Type.schema.ts for why `z.object({})` is the correct placeholder shape.
 */
export const Step6ReviewSchema = z.object({})
