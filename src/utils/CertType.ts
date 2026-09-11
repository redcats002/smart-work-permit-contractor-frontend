import { ECertType } from '@/enums/modules/certificate/CertType.enum'

export interface ICertTypeOption {
  value: string
  /** True only for a value that is not a real `ECertType` at all. Rendered as a normal, SELECTABLE
   * option (see `CertTypeSelect.vue`'s note on why it is not PrimeVue `option-disabled`) with a
   * label that flags it as outside the standard list, so it stays visible and preserved. */
  legacy: boolean
}

/**
 * The certType Select's option list: the full `ECertType` vocabulary, plus `currentValue` — the
 * certificate's already-stored `certType` — whenever it is not in it, flagged `legacy`, so opening
 * the edit form on an existing certificate never renders blank and never silently rewrites it.
 *
 * Wayfinder 103: there is no worker role to filter by any more (096 made certType 1:1 with the
 * permit type and dropped the api's `ROLE_ALLOWED_CERT_TYPES`; 103 deleted `Worker.role`).
 */
export function buildCertTypeOptions (currentValue: string | undefined | null): ICertTypeOption[] {
  const allValues = Object.values(ECertType) as string[]
  const values = currentValue && !allValues.includes(currentValue) ? [...allValues, currentValue] : allValues
  return values.map((value: string): ICertTypeOption => ({ value, legacy: !allValues.includes(value) }))
}
