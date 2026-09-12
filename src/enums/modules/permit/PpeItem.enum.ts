/**
 * Wayfinder 097 (CR round 4, ruling 17, PROMPT-LOG.md session 13), the contractor half — the api
 * half shipped alone; see the ticket's "Correction (2026-09-11)" section. Mirrors the api's
 * `src/libs/config/ppe-vocabulary.const.ts` `EPpeItem` verbatim — the api owns this vocabulary,
 * this repo owns nothing of it, same relationship `CertType.enum.ts` has with
 * `worker-vocabulary.const.ts`. `check-worker-vocabulary-sync.mjs` already expects this exact
 * path and enum name.
 *
 * PROVISIONAL LIST, carried over from the api's own caveat unchanged: transcribed from the field
 * report's text ("safety glasses, hardhat, respiratory protection, earmuffs, construction vest,
 * gloves, protective boots"), never checked against the `image.png` the report also referenced.
 * Treat it as provisional until someone can.
 *
 * `ppeDeclared` is validated against this exact vocabulary at write time and an unrecognised item
 * is REJECTED (400) by the api — unlike `certType`/`role`, there is no legacy free-text data to
 * tolerate here, so do not add a "legacy spelling" fallback the way `CertTypeSelect.vue` does.
 */
export enum EPpeItem {
  SAFETY_GLASSES = 'Safety Glasses',
  HARDHAT = 'Hardhat',
  RESPIRATORY_PROTECTION = 'Respiratory Protection',
  EARMUFFS = 'Earmuffs',
  CONSTRUCTION_VEST = 'Construction Vest',
  GLOVES = 'Gloves',
  PROTECTIVE_BOOTS = 'Protective Boots'
}

export const PPE_ITEMS: EPpeItem[] = Object.values(EPpeItem)

/** i18n key fragment for a PPE item value — same slugging `certTypeSlug`/`workerRoleSlug` use. */
export function ppeItemSlug (value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-')
}
