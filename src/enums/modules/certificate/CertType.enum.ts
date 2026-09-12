/**
 * Wayfinder 049/050/059/060, amended by CR round 3 rulings 7-8 (PROMPT-LOG.md session 12,
 * 2026-09-10) and by CR round 4 (wayfinder 096/115, 2026-09-11). Mirrors the API's
 * `src/libs/config/worker-vocabulary.const.ts` `ECertType` verbatim (read-only there — this repo
 * owns `EWorkerRole`, per that file's own comment, but the API owns `ECertType`).
 *
 * KNOWN INTERIM STATE (061's amendment to 050, still true): the API does not yet expose this
 * vocabulary over the wire, so this is a compiled-in copy, not a fetch. When a route exposing it
 * ships, this file's `ECertType` should be replaced by that response,
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

/** i18n key fragment for a cert type value — same slugging `workerRoleSlug` already uses. */
export function certTypeSlug (value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-')
}
