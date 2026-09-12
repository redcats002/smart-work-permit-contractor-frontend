import { z } from 'zod'

/**
 * `POST /permits/:id/close-request` — `reason` is optional on the wire (only the safety officer
 * who actually closes owes one, per `close.model.ts` on the api side). No min-length gate: an
 * empty textarea is a valid, reason-less request.
 */
export const RequestCloseSchema = z.object({
  reason: z.string().optional()
})

export type TRequestCloseFormValues = z.infer<typeof RequestCloseSchema>

export function useRequestCloseInitialValues (): TRequestCloseFormValues {
  return { reason: '' }
}
