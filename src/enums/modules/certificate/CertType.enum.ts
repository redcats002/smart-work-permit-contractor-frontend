import { EWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'

/**
 * Wayfinder 049/050/059/060, amended by CR round 3 rulings 7-8 (PROMPT-LOG.md session 12,
 * 2026-09-10) and by CR round 4 (wayfinder 096/115, 2026-09-11). Mirrors the API's
 * `src/libs/config/worker-vocabulary.const.ts` `ECertType` verbatim (read-only there — this repo
 * owns `EWorkerRole`, per that file's own comment, but the API owns `ECertType`).
 *
 * KNOWN INTERIM STATE (061's amendment to 050, still true): the API does not yet expose this
 * vocabulary over the wire, so this is a compiled-in copy, not a fetch. When a route exposing it
 * ships, this file's `ECertType`/`ROLE_ALLOWED_CERT_TYPES` should be replaced by that response,
 * not kept as a second source of truth.
 *
 * `GAS_TESTING` is DROPPED (wayfinder 096/115): it described an inspector's competence for the
 * gas log, never a permit requirement, and the api's own copy dropped it the same day (`c06d810`)
 * — `certType` is now exactly 1:1 with `PermitType`. A stored `certType` value of `'Gas Testing'`
 * on an existing row is UNCHANGED by this — it is tolerated exactly like any other unrecognised
 * legacy spelling by `CertTypeSelect.vue`'s "legacy" handling, never coerced, never dropped.
 */
export enum ECertType {
  HOT_WORK = 'Hot Work',
  CONFINED_SPACE_ENTRY = 'Confined Space Entry',
  WORKING_AT_HEIGHTS = 'Working at Heights'
}

export type TCertType = `${ECertType}`

/**
 * role -> the certificate type(s) that fit that role. ADVISORY ONLY, mirroring the API's map of
 * the same name: this repo's gate (the server, off by default behind `CERT_TYPE_REQUIRED`) never
 * reads this table, and neither does this form's own validation. It exists solely to filter the
 * certificate form's Select down to what actually makes sense for the worker selected — a
 * contractor never has to guess which of four names fits an "Entrant".
 */
export const ROLE_ALLOWED_CERT_TYPES: Record<EWorkerRole, ECertType[]> = {
  [EWorkerRole.FIRE_WATCHER]: [ECertType.HOT_WORK],
  [EWorkerRole.OPERATOR]: [ECertType.HOT_WORK],
  [EWorkerRole.HELPER]: [ECertType.HOT_WORK],
  [EWorkerRole.ENTRANT]: [ECertType.CONFINED_SPACE_ENTRY],
  [EWorkerRole.ATTENDANT]: [ECertType.CONFINED_SPACE_ENTRY],
  // wayfinder 096/115 — Gas Tester's own competence (formerly ECertType.GAS_TESTING) is dropped
  // with the value; Confined Space Entry is what this role actually enters permits under.
  [EWorkerRole.GAS_TESTER]: [ECertType.CONFINED_SPACE_ENTRY],
  [EWorkerRole.WORKER]: [ECertType.WORKING_AT_HEIGHTS],
  [EWorkerRole.SCAFFOLD_INSPECTOR]: [ECertType.WORKING_AT_HEIGHTS],
  [EWorkerRole.SAFETY_WATCHER]: [ECertType.WORKING_AT_HEIGHTS],
  [EWorkerRole.SUPERVISOR]: [ECertType.HOT_WORK, ECertType.CONFINED_SPACE_ENTRY, ECertType.WORKING_AT_HEIGHTS]
}

/** i18n key fragment for a cert type value — same slugging `workerRoleSlug` already uses. */
export function certTypeSlug (value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-')
}
