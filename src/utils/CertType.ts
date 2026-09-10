import { ECertType, ROLE_ALLOWED_CERT_TYPES } from '@/enums/modules/certificate/CertType.enum'
import type { EWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'

export interface ICertTypeOption {
  value: string
  /** True only for a value that is not a real `ECertType` at all — never for one merely filtered
   * out by role. Rendered as a normal, SELECTABLE option (see `CertTypeSelect.vue`'s own note on
   * why it is not PrimeVue `option-disabled`) with a label that flags it as outside the standard
   * list, so it stays visible and preserved rather than disappearing. */
  legacy: boolean
}

export interface ICertTypeOptionsResult {
  options: ICertTypeOption[]
  /** False whenever `role` matched nothing in `ROLE_ALLOWED_CERT_TYPES` — including `undefined`,
   * `null`, empty, and real-but-uncatalogued values like `Welder` or `ช่างซ่อมบำรุง` (050's data
   * audit). The Select falls back to the full vocabulary rather than an empty list, because a
   * worker whose role is outside the vocabulary must stay certifiable. */
  roleRecognized: boolean
}

function isKnownRole (role: string): role is EWorkerRole {
  return Object.prototype.hasOwnProperty.call(ROLE_ALLOWED_CERT_TYPES, role)
}

/**
 * Builds the certType Select's option list for one worker.
 *
 * - A recognised role narrows the list to `ROLE_ALLOWED_CERT_TYPES[role]` — the actual fix for
 *   the reported complaint (a picker instead of a free-text box asking an unexplained question).
 * - An unrecognised role (unknown, or absent because no worker is selected yet) falls back to the
 *   full `ECertType` vocabulary, never an empty Select.
 * - `currentValue` — the certificate's already-stored `certType` — is ALWAYS present in the
 *   result even when role-filtering would otherwise exclude it, so opening the edit form on an
 *   existing certificate never renders blank and never silently rewrites the value on save. It is
 *   `legacy` only when it does not match any `ECertType` at all (a genuinely unrecognised value,
 *   e.g. a drifted spelling); a real `ECertType` merely outside the filtered set (say, a
 *   Supervisor's card on an Entrant after a role correction) is NOT `legacy` — it is a real
 *   vocabulary value, just not one this role ordinarily needs.
 */
export function buildCertTypeOptions (
  role: string | undefined | null,
  currentValue: string | undefined | null
): ICertTypeOptionsResult {
  const allValues = Object.values(ECertType) as string[]
  const roleRecognized = !!role && isKnownRole(role)
  const base = roleRecognized ? (ROLE_ALLOWED_CERT_TYPES[role as EWorkerRole] as string[]) : allValues

  const values = [...base]
  if (currentValue && !values.includes(currentValue)) values.push(currentValue)

  const options = values.map((value: string): ICertTypeOption => ({
    value,
    legacy: !allValues.includes(value)
  }))

  return { options, roleRecognized }
}
