import { beforeAll, describe, expect, it } from 'vitest'
import { setLocale } from '@/plugins/I18n.plugin'
import { AddCertificateSchema, type IAddCertificateFormState } from '@/pages/certificate/schema/AddCertificate.schema'

/**
 * Wayfinder 117 — this schema's base object parse is what the four certificate forms' Form
 * resolver actually runs on `values`. Before this ticket, `workerId` was never in those `values`
 * at all (a bare `<input type="hidden">` never registers with `@primevue/forms` — see this
 * schema's own top comment for the full trace), so `z.number()` failed the base parse on every
 * submit, `event.valid` never reflected it, and any cross-field `.refine()` chained after the
 * base object — there was exactly one, `expiryAfterIssued` — never ran. These tests exercise the
 * schema directly, independent of any form/component wiring, to prove both halves of the fix:
 * `workerId` is still a real, enforced requirement, and `expiryAfterIssued` is genuinely gone
 * rather than silently reachable again.
 */
function validInput (overrides: Partial<Record<keyof IAddCertificateFormState, unknown>> = {}): Record<string, unknown> {
  return {
    workerId: 761,
    certType: 'Confined Space Entry',
    issuedDate: new Date('2026-01-01'),
    expiryDate: new Date('2030-01-01'),
    licenceNo: 'LIC-001',
    description: '',
    file: undefined,
    ...overrides
  }
}

describe('AddCertificateSchema', () => {
  beforeAll((): void => {
    setLocale('en')
  })

  it('parses a fully valid input', () => {
    const result = AddCertificateSchema.safeParse(validInput())
    expect(result.success).toBe(true)
  })

  it('still fails the base parse when workerId is missing — the requirement itself is untouched', () => {
    const withoutWorkerId = validInput()
    delete withoutWorkerId.workerId
    const result = AddCertificateSchema.safeParse(withoutWorkerId)
    expect(result.success).toBe(false)
  })

  it('fails when workerId is a string rather than a number — proves the fix feeds the resolver a real number, not a stringified id', () => {
    const result = AddCertificateSchema.safeParse(validInput({ workerId: '761' }))
    expect(result.success).toBe(false)
  })

  /**
   * The rule this ticket found dead and removed: registering `workerId` properly would have
   * made this `.refine()` start firing for the first time ever. Checked against the api
   * (`smart-work-permit-api/src/modules/certificate/commands/{create,update}/*.model.ts` and
   * `.service.ts`) — there is no ordering check on these two dates server-side, in either
   * direction — so shipping it would refuse a PATCH/POST the server accepts. This asserts the
   * removal actually took effect at the schema level, not merely that the UI stopped calling it.
   */
  it('does NOT reject an expiry date before the issued date — expiryAfterIssued was removed, not revived', () => {
    const result = AddCertificateSchema.safeParse(validInput({
      issuedDate: new Date('2030-01-01'),
      expiryDate: new Date('2026-01-01')
    }))
    expect(result.success).toBe(true)
  })

  it('does NOT reject an expiry date equal to the issued date either', () => {
    const sameDate = new Date('2028-06-01')
    const result = AddCertificateSchema.safeParse(validInput({ issuedDate: sameDate, expiryDate: sameDate }))
    expect(result.success).toBe(true)
  })
})
