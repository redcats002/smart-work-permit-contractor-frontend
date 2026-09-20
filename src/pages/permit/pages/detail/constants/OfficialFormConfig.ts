import { permitAuthorName, type IPermitWorker } from '@/models/modules/permit/Permit.model'
import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { EPpeItem, ppeItemSlug } from '@/enums/modules/permit/PpeItem.enum'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import type {
  IOfficialFormCheckboxItem, IOfficialFormChecklistItem, IOfficialFormConfig, IOfficialFormField, IOfficialFormSection,
  TOfficialFormBlock
} from './OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Pure, unit-testable
 * builder functions: permit data (+ the handful of extra reads the print trigger fetches lazily,
 * see `useOfficialPermitForm.ts`) in, an `IOfficialFormConfig` data structure out. No Vue, no
 * `vue-i18n` import here on purpose — every label is an i18n KEY, resolved by the block components,
 * so these functions stay plain and deterministic under test.
 *
 * Every mapping decision below that is NOT a direct, confident field read is called out in its own
 * comment — see the implementation report for the consolidated list.
 */

/** `YYYY-MM-DD` → `DD/MM/YYYY`. Pure string rearrangement, never a `Date` parse — `startDate`/
 * `endDate` are calendar-only strings with no time-of-day (see `IPermitBase`'s own doc comment),
 * so parsing them as an instant and reformatting risks an off-by-one-day shift under a browser
 * whose local zone is behind UTC. This mirrors this repo's `bangkokCalendarDay` reasoning in
 * `PermitReportGaps.ts` without pulling in `dayjs` for a one-line rearrangement. */
function formatCalendarDate (value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function formatDateRange (startDate: string, endDate: string): string {
  const start = formatCalendarDate(startDate)
  if (startDate === endDate) return start
  return `${start} – ${formatCalendarDate(endDate)}`
}

/**
 * Copied verbatim from `PermitPrintLayout.vue`'s own `clock()` — same UTC-anchored `dailyStart`/
 * `dailyEnd` shape (see `IPermitBase`'s "067 UTC TRAP" doc comment), same fixed `Asia/Bangkok`
 * rendering already established for this repo's other print feature. Kept as a small duplicate
 * rather than extracted into a shared util: it is four lines, used by exactly two files, and this
 * file must stay free of any component/composable import.
 */
function formatDailyClock (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  }).format(parsed)
}

function formatDailyTimeRange (dailyStart: string, dailyEnd: string): string {
  return `${formatDailyClock(dailyStart)}–${formatDailyClock(dailyEnd)}`
}

/**
 * PPE prepared free-text line — the one item in "การเตรียมการเบื้องต้น" that DOES map cleanly.
 * `ppeItemSlug` mirrors `PpeItem.enum.ts`'s own i18n-key slugging; the caller (the block component)
 * resolves each slug through `permit.ppeWorkers.item.<slug>`, so this returns keys, not label text.
 */
function ppeDeclaredSlugs (permit: IPermitDetail): string[] {
  return permit.ppeDeclared.map((item: EPpeItem): string => ppeItemSlug(item))
}

/**
 * Worker names for the form's fixed 2-line field. Any worker past the second is NOT silently
 * dropped — the caller adds an overflow note field when `workers.length > 2` (judgment call: exact
 * wording is this builder's own choice, see the report).
 */
function firstTwoWorkerNames (workers: IPermitWorker[]): [string | null, string | null] {
  return [workers[0]?.workerName ?? null, workers[1]?.workerName ?? null]
}

/**
 * Best-effort text match for Confined Space's rescue-standby name — no dedicated field exists.
 * A worker's free-text `roleOnPermit` (wayfinder 103 — plain string, no enum) containing "standby"
 * or "rescue" (case-insensitive) is read as that worker being the rescue standby. This is
 * deliberately loose and documented as a judgment call, not a hard product rule.
 */
function findRescueStandbyName (workers: IPermitWorker[]): string | null {
  const match = workers.find((worker: IPermitWorker): boolean => (/standby|rescue/i).test(worker.roleOnPermit))
  return match?.workerName ?? null
}

/** Shared request-details fields for Hot Work / Working at Height (their section 1 is identical). */
function buildRequestDetailsFields (
  permit: IPermitDetail, locationValue: string | null, firmName: string | null
): IOfficialFormField[] {
  const [worker1, worker2] = firstTwoWorkerNames(permit.workers)
  const overflow = permit.workers.length - 2
  const fields: IOfficialFormField[] = [
    { labelKey: 'workDate', value: formatDateRange(permit.startDate, permit.endDate) },
    { labelKey: 'workTime', value: formatDailyTimeRange(permit.dailyStart, permit.dailyEnd) },
    { labelKey: 'location', value: locationValue },
    { labelKey: 'worker1', value: worker1 },
    { labelKey: 'worker2', value: worker2 }
  ]
  if (overflow > 0) {
    fields.push({ labelKey: 'workersOverflow', value: String(overflow) })
  }
  fields.push({ labelKey: 'requester', value: permitAuthorName(permit.createdBy) || null })
  // This platform has no internal-employee permits — every permit is a contractor's own, so the
  // employee/contractor checkbox is not modelled as data at all; the block component always
  // renders the "ผู้รับเหมา / Contractor" box checked (see the OfficialPermitFormLayout template).
  fields.push({ labelKey: 'companyName', value: firmName })
  // No department/phone field exists anywhere in this app's data model — left blank rather than
  // fabricated, per the task's own instruction.
  fields.push({ labelKey: 'department', value: null }, { labelKey: 'phone', value: null })
  // No separate `description` field exists on `IPermitBase` — `title` is this permit's entire
  // free-text description, so it is the sole source for this row.
  fields.push({ labelKey: 'workDescription', value: permit.title })
  return fields
}

/**
 * The "type of work" checkbox row is Hot Work only (welding/grinding/electric-weld/cutting/
 * arc-weld/other) and has NO source data anywhere in this app — every box prints unchecked.
 */
function buildTypeOfWorkBlock (): TOfficialFormBlock {
  const keys = ['welding', 'grinding', 'electricWeld', 'cutting', 'arcWeld', 'other']
  return {
    kind: 'checkbox-row',
    mode: 'single',
    items: keys.map((key: string): IOfficialFormCheckboxItem => ({
      key, labelKey: `typeOfWork.${key}`, answer: null
    }))
  }
}

/**
 * Equipment-prep quantities — fire extinguisher count, ladder height, etc. NONE of this exists in
 * the data model (confirmed against `IPermitBase`/`IPermitWorker`/`IPermitPhoto` — nothing tracks
 * equipment counts). Every row below is a label only, `value: null`. The transcription's ambiguous
 * shared "sitting cage height ___ floors" row (present for both Hot Work and Height per the source
 * note, exact original Thai wording unclear from the transcription) is rendered as a generic
 * "other equipment" blank line rather than guessed — flagged in the report.
 */
function buildEquipmentPrepFields (type: TPermitType): IOfficialFormField[] {
  const rows: string[] = type === EPermitType.HEIGHTS
    ? ['scaffoldFloors', 'steelLadderFloors', 'woodenLadderMeters', 'warningSigns', 'otherHazardEquip', 'otherRow']
    : ['fireExtinguisherCount', 'fireproofClothCount', 'warningSigns', 'otherHazardEquip', 'otherRow']
  return rows.map((key: string): IOfficialFormField => ({ labelKey: `equipmentPrep.${key}`, value: null }))
}

/**
 * Sections 2/3/4 (pre/during/post-work checks). Item wording is verbatim from the owner's
 * reference paper form images, re-read directly 2026-09-13 (see the `field.*Section*Item*` locale
 * keys) — supersedes the earlier "Check item N" structural placeholder, which existed only because
 * an initial text-only transcription gave item COUNTS, never the wording.
 */
function buildRealChecklistItems (labelKeys: string[]): IOfficialFormChecklistItem[] {
  return labelKeys.map((labelKey: string): IOfficialFormChecklistItem => ({ key: labelKey, labelKey }))
}

const HOT_SECTION2_ITEM_KEYS: string[] = [
  'hotSection2Item1', 'hotSection2Item2', 'hotSection2Item3', 'hotSection2Item4',
  'hotSection2Item5', 'hotSection2Item6', 'hotSection2Item7', 'hotSection2Item8'
]
const HEIGHTS_SECTION2_ITEM_KEYS: string[] = [
  'heightsSection2Item1', 'heightsSection2Item2', 'heightsSection2Item3',
  'heightsSection2Item4', 'heightsSection2Item5', 'heightsSection2Item6'
]
const SHARED_SECTION3_ITEM_KEYS: string[] = ['sharedSection3Item1', 'sharedSection3Item2']
const HOT_SECTION4_ITEM_KEYS: string[] = ['hotSection4Item1', 'hotSection4Item2']
const HEIGHTS_SECTION4_ITEM_KEYS: string[] = [
  'heightsSection4Item1', 'heightsSection4Item2', 'heightsSection4ToolsStored'
]

/** Options threaded in from `useOfficialPermitForm.ts` — everything not directly on `IPermitDetail`. */
export interface IBuildOfficialFormOptions {
  /** The permit's pin name (`Pin.provider.getById`), resolved lazily. `null` if unset or unresolved. */
  pinName: string | null
  /** `ContractorProfile.firmName`, resolved lazily via `UserProvider.me()`. `null` if unreachable. */
  firmName: string | null
  /** The single most recent `gas_log_entries` row (Confined Space only). `null` = no reading at all. */
  latestGasEntry: IGasLogEntryWire | null
}

function resolveLocation (permit: IPermitDetail, pinName: string | null): string | null {
  return pinName ?? permit.location
}

/**
 * Hot Work / Working at Height share section 1's layout, section 2/3/4's shape (differing only in
 * item counts) and the "PPE prepared" free-text line — this is the shared base builder ruling 3
 * asks for. `overrides` supplies exactly the per-type differences: the type-of-work row (Hot
 * only), the equipment-prep rows, and section 2/3/4's item counts + footer validity note.
 */
function buildHotWorkHeightConfig (
  type: typeof EPermitType.HOT | typeof EPermitType.HEIGHTS, permit: IPermitDetail, options: IBuildOfficialFormOptions
): IOfficialFormConfig {
  const location = resolveLocation(permit, options.pinName)
  const section1Blocks: TOfficialFormBlock[] = [
    { kind: 'info-grid', fields: buildRequestDetailsFields(permit, location, options.firmName) },
    { kind: 'checkbox-row', mode: 'single', items: [{ key: 'contractor', labelKey: 'contractorCheckbox', answer: 'yes' }] }
  ]
  if (type === EPermitType.HOT) section1Blocks.push(buildTypeOfWorkBlock())
  section1Blocks.push(
    { kind: 'info-grid', fields: buildEquipmentPrepFields(type) }, { kind: 'info-grid', fields: [{ labelKey: 'ppePrepared', value: ppeDeclaredSlugs(permit).join(', ') || null }] }
  )

  const isHeights = type === EPermitType.HEIGHTS
  const section2ItemKeys = isHeights ? HEIGHTS_SECTION2_ITEM_KEYS : HOT_SECTION2_ITEM_KEYS
  const section4ItemKeys = isHeights ? HEIGHTS_SECTION4_ITEM_KEYS : HOT_SECTION4_ITEM_KEYS
  const signatureRoleKeys = ['signatureSafetyOfficer', 'signatureAreaOwnerInspector', 'signatureAreaSupervisor']

  const sections: IOfficialFormSection[] = [
    { number: 1, titleKey: 'section1', blocks: section1Blocks },
    {
      number: 2,
      titleKey: 'section2',
      blocks: [
        { kind: 'checklist-grid', items: buildRealChecklistItems(section2ItemKeys), dateColumns: 3 },
        { kind: 'signature-lines', roleLabelKeys: signatureRoleKeys },
        { kind: 'info-grid', fields: [{ labelKey: 'approvalDateRange', value: null }, { labelKey: 'approvingManager', value: null }] }
      ]
    },
    {
      number: 3,
      titleKey: 'section3',
      blocks: [
        { kind: 'checklist-grid', items: buildRealChecklistItems(SHARED_SECTION3_ITEM_KEYS), dateColumns: 3 },
        { kind: 'signature-lines', roleLabelKeys: signatureRoleKeys }
      ]
    },
    {
      number: 4,
      titleKey: 'section4',
      blocks: [
        { kind: 'checklist-grid', items: buildRealChecklistItems(section4ItemKeys), dateColumns: 3 },
        { kind: 'signature-lines', roleLabelKeys: signatureRoleKeys },
        { kind: 'footer-note', textKey: 'validityNote', params: { days: isHeights ? 3 : 7 } }
      ]
    }
  ]

  return {
    formTitleKey: `permit.detail.print.official.${type}.formTitle`,
    permitNumber: permit.id,
    sections
  }
}

/**
 * Confined Space's section 3 (11 fixed safety-measure items). This app's OWN 13-item
 * `preWorkChecklist` (`SafetyChecklist.ts`'s `confined-1`..`confined-13`, locale text in
 * `permit.create.steps.safetyChecks.checklist.confined.*`) was checked item-by-item against the
 * form's 11 fixed items transcribed in the sibling repo's progress.md:
 *
 *   Form: ventilation system / gas-detection tested / spark-proof electrical / entry points
 *   sealed / no flammable-atmosphere welding / fire route cleared / communication plan with
 *   outside watcher / not a gas-trapping space / fire-extinguishing equipment ready / no burning
 *   work permitted / accepts safety measures (Yes/No).
 *
 *   App: tools & equipment safe for entry / electrical de-energized & locked / valves blanked-
 *   locked out / atmosphere safe for entry / attendant stationed outside / rescue equipment ready
 *   / communication system established / lighting adequate / lifeline attached / breathing
 *   apparatus ready / emergency exit unobstructed / rescue team on standby / entry permit
 *   counter-signed by SO.
 *
 * No index lines up (e.g. app #1 "tools & equipment safe" vs form #1 "ventilation system"; app #7
 * "communication system established" is close to form #7 "communication plan with outside
 * watcher" but that is the ONLY plausible pair, not a full-list correspondence) — there is no
 * confident 1:1 mapping. Per the task's own instruction ("if not, print blank rather than risk a
 * wrong answer"), this returns every item unanswered. Item 11 (Yes/No accept-safety-measures) has
 * no counterpart in `preWorkChecklist` at all regardless, so it is always blank too.
 */
function buildConfinedSafetyMeasuresBlock (): TOfficialFormBlock {
  return {
    kind: 'checkbox-row',
    mode: 'tri-state',
    items: Array.from({ length: 11 }, (_unused: unknown, index: number): IOfficialFormCheckboxItem => ({
      key: `safety-measure-${index + 1}`, labelKey: 'safetyMeasureItem', answer: null
    }))
  }
}

/**
 * Confined Space's 8-item PPE/life-safety list, cross-checked against `EPpeItem`'s 7-item
 * vocabulary (Safety Glasses, Hardhat, Respiratory Protection, Earmuffs, Construction Vest,
 * Gloves, Protective Boots). Only ONE row has a clear, unambiguous correspondence: Hardhat → the
 * form's "hard hat" row. "Respiratory Protection" is deliberately NOT mapped to either "breathing
 * apparatus" or "gas mask / full-face mask" — those are two distinct form rows and the app's own
 * vocabulary is too generic to say confidently which one it means. Every other row (wire rope/
 * carabiner, life-safety rope, oxygen mask/CPR set, the blank 8th line) has no source at all.
 */
function buildConfinedPpeBlock (permit: IPermitDetail): TOfficialFormBlock {
  const hardhatChecked = permit.ppeDeclared.includes(EPpeItem.HARDHAT)
  const keys = ['breathingApparatus', 'hardHat', 'safetyHarness', 'wireRopeCarabiner', 'gasMask', 'lifeSafetyRope', 'oxygenMaskCpr', 'other']
  return {
    kind: 'checkbox-row',
    mode: 'single',
    items: keys.map((key: string): IOfficialFormCheckboxItem => ({
      key,
      labelKey: `confinedPpe.${key}`,
      answer: key === 'hardHat' && hardhatChecked ? 'yes' : null
    }))
  }
}

/**
 * Confined Space's up-to-4-worker roster. `bloodPressure`/`alcoholReading` are this permit type's
 * own health-check fields (`IPermitWorker`'s doc comment: "Confined Space only") — used here since
 * the form has room for a cert+medical column, per the task's own suggestion.
 */
function buildConfinedWorkerTableBlock (workers: IPermitWorker[]): TOfficialFormBlock {
  const rows = workers.slice(0, 4).map((worker: IPermitWorker): (string | null)[] => [
    worker.workerName, worker.roleOnPermit || null, worker.bloodPressure ?? null, worker.alcoholReading ?? null
  ])
  return {
    kind: 'worker-table',
    columns: [
      { labelKey: 'workerName' }, { labelKey: 'workerRole' }, { labelKey: 'workerBloodPressure' }, { labelKey: 'workerAlcohol' }
    ],
    rows,
    blankRowCount: Math.max(0, 4 - rows.length)
  }
}

/** Confined Space atmosphere readings — rule 2. `null` (no gas log entry at all) omits the whole block. */
function buildAtmosphereFields (entry: IGasLogEntryWire | null): IOfficialFormField[] | null {
  if (!entry) return null
  return [
    { labelKey: 'atmosphereO2', value: entry.o2 },
    { labelKey: 'atmosphereLel', value: entry.lel },
    // Fixed labels per ruling 2 — "CO"/"SO2" are the slot LABELS, not free text read from data.
    { labelKey: 'atmosphereToxic1', value: entry.co },
    { labelKey: 'atmosphereToxic2', value: entry.so2 }
  ]
}

function buildConfinedSpaceConfig (permit: IPermitDetail, options: IBuildOfficialFormOptions): IOfficialFormConfig {
  const location = resolveLocation(permit, options.pinName)
  const requestDate = permit.submittedAt ?? permit.createdAt

  const section1Fields: IOfficialFormField[] = [
    { labelKey: 'requestDate', value: formatCalendarDate(requestDate.slice(0, 10)) },
    { labelKey: 'permitNumber', value: permit.id },
    { labelKey: 'location', value: location },
    { labelKey: 'workDate', value: formatDateRange(permit.startDate, permit.endDate) },
    { labelKey: 'workTime', value: formatDailyTimeRange(permit.dailyStart, permit.dailyEnd) },
    { labelKey: 'workDescription', value: permit.title }
  ]

  const section2Blocks: TOfficialFormBlock[] = [
    // This platform has no internal-employee permits — always "external contractor", same
    // reasoning as the Hot Work/Height contractor checkbox above.
    { kind: 'checkbox-row', mode: 'single', items: [{ key: 'external', labelKey: 'teamExternal', answer: 'yes' }] },
    buildConfinedWorkerTableBlock(permit.workers),
    {
      kind: 'info-grid',
      fields: [
        { labelKey: 'supervisor', value: permit.foreman || null },
        { labelKey: 'rescueStandby', value: findRescueStandbyName(permit.workers) }
      ]
    }
  ]

  const atmosphereFields = buildAtmosphereFields(options.latestGasEntry)
  const section3Blocks: TOfficialFormBlock[] = [
    buildConfinedSafetyMeasuresBlock(),
    buildConfinedPpeBlock(permit)
  ]
  if (atmosphereFields) section3Blocks.push({ kind: 'info-grid', fields: atmosphereFields })

  const sections: IOfficialFormSection[] = [
    { number: 1, titleKey: 'section1', blocks: [{ kind: 'info-grid', fields: section1Fields }] },
    { number: 2, titleKey: 'section2', blocks: section2Blocks },
    { number: 3, titleKey: 'section3', blocks: section3Blocks },
    {
      number: 4,
      titleKey: 'section4',
      blocks: [
        { kind: 'signature-lines', roleLabelKeys: ['signatureRequester', 'signatureSupervisor', 'signatureApprover'] },
        { kind: 'footer-note', textKey: 'entryScopeNote' },
        { kind: 'footer-note', textKey: 'restoredNote' }
      ]
    }
  ]

  return {
    formTitleKey: 'permit.detail.print.official.confined.formTitle',
    permitNumber: permit.id,
    sections
  }
}

export function buildOfficialFormConfig (permit: IPermitDetail, options: IBuildOfficialFormOptions): IOfficialFormConfig {
  switch (permit.type) {
    case EPermitType.HOT:
      return buildHotWorkHeightConfig(EPermitType.HOT, permit, options)
    case EPermitType.HEIGHTS:
      return buildHotWorkHeightConfig(EPermitType.HEIGHTS, permit, options)
    case EPermitType.CONFINED:
      return buildConfinedSpaceConfig(permit, options)
    default:
      throw new Error(`buildOfficialFormConfig: unknown permit type ${String(permit.type)}`)
  }
}
